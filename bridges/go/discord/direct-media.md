# Direct media access
_New in version 0.4.0_

To avoid spamming your homeserver's media repository with all files from
Discord, the bridge has an option to generate fake `mxc://` URIs that contain
the Discord media ID. The media repo or your reverse proxy can then handle
those URIs specially to fetch content directly from the Discord CDN.

To enable this mode, set `bridge` -> `media_patterns` -> `enabled` to `true`
in the bridge config. You can then configure each of the patterns or leave the
defaults.

## Ways to use patterns

### Default pattern and MSC3860-compatible media repo
If your media repo supports [MSC3860], you can use the default patterns out of
the box with no modifications. Your media repo will act like discord-media.mau.dev
is a federated Matrix server, so when your client requests Discord media, your
media repo will ask discord-media.mau.dev, which redirects to cdn.discordapp.com.
Your media repo then downloads the media and caches it as remote media (like it
does for all federated media).

As of writing, normal Matrix servers don't support MSC3860 yet, but they likely
will in the future once the MSC passes.

The software on discord-media.mau.dev is just a Caddy instance with the first
example config below, plus a static .well-known file to redirect federation to
443. You can find the raw config at [mau.dev/maunium/caddy].

[mau.dev/maunium/caddy]: https://mau.dev/maunium/caddy/-/blob/master/vhosts/discord-media.mau.dev
[MSC3860]: https://github.com/matrix-org/matrix-spec-proposals/pull/3860

### Redirect in reverse proxy
You can also configure your reverse proxy to redirect `mxc://discord-media.mau.dev/*`
downloads directly to cdn.discordapp.com. This method doesn't involve your
media repo at all, so it already works with most clients. However, it won't
work with servers that don't support MSC3860, as they'd still try to connect to
discord-media.mau.dev, which may be a problem if you want to use your bridge in
federated rooms.

<details>
<summary>Caddy config example</summary>

```Caddyfile
matrix.example.com {
	handle /_matrix/media/*/download/discord-media.mau.dev/* {
		# The redirect must have CORS headers to let web clients follow it.
		header Access-Control-Allow-Origin *
		# Need to use a route directive to make the uri mutations apply before redir
		route {
			# Remove path prefix
			uri path_regexp ^/_matrix/media/.+/download/discord-media\.mau\.dev/ /
			# The mxc patterns use | instead of /, so replace it first turning the path into attachments/1234/5678/filename.png
			uri replace "%7C" /
			# Then redirect to cdn.discordapp.com/attachments/1234/5678/filename.png with HTTP 307
			redir https://cdn.discordapp.com{uri} 307
		}
	}
	# Special-case stickers because they don't have CORS headers on cdn.discordapp.com for some reason
	handle /_matrix/media/*/download/discord-media.mau.dev/stickers|* {
		header Access-Control-Allow-Origin *
		route {
			uri path_regexp ^/_matrix/media/.+/download/discord-media\.mau\.dev/ /
			uri replace "%7C" /
			redir https://media.discordapp.net{uri} 307
		}
	}
	# Do the same for thumbnails, but redirect to media.discordapp.net (which is Discord's thumbnailing server, and happens to use similar width/height params as Matrix)
	# Alternatively, you can point this at cdn.discordapp.com too. Clients shouldn't mind even if they get a bigger image than they asked for.
	handle /_matrix/media/*/thumbnail/discord-media.mau.dev/* {
		header Access-Control-Allow-Origin *
		route {
			uri path_regexp ^/_matrix/media/.+/thumbnail/discord-media\.mau\.dev/ /
			uri replace "%7C" /
			redir https://media.discordapp.net{uri} 307
		}
	}
	# The usual proxying to your homeserver
	handle /_matrix/* {
		reverse_proxy http://localhost:8008
	}
}
```

</details>

<details>
<summary>Nginx config example</summary>

```nginx
server {
	listen 443;
	server_name matrix.example.com;
	# ... usual /_matrix location block and other stuff ...

	location ~ ^/_matrix/media/(?:v3|r0)/download/discord-media.mau.dev/attachments\|([0-9]+)\|([0-9]+)\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		return 307 https://cdn.discordapp.com/attachments/$1/$2/$3;
	}
	location ~ ^/_matrix/media/(?:v3|r0)/download/discord-media.mau.dev/emojis\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		return 307 https://cdn.discordapp.com/emojis/$1;
	}
	location ~ ^/_matrix/media/(?:v3|r0)/download/discord-media.mau.dev/stickers\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		# Stickers don't have CORS headers on cdn.discordapp.com for some reason, so always use media.
		return 307 https://media.discordapp.net/stickers/$1;
	}
	location ~ ^/_matrix/media/(?:v3|r0)/download/discord-media.mau.dev/avatars\|([0-9]+)\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		return 307 https://cdn.discordapp.com/avatars/$1/$2;
	}

	# Thumbnails (optional-ish)
	location ~ ^/_matrix/media/(?:v3|r0)/thumbnail/discord-media.mau.dev/attachments\|([0-9]+)\|([0-9]+)\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		return 307 https://media.discordapp.net/attachments/$1/$2/$3?$args;
	}
	location ~ ^/_matrix/media/(?:v3|r0)/thumbnail/discord-media.mau.dev/emojis\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		return 307 https://media.discordapp.net/emojis/$1?$args;
	}
	location ~ ^/_matrix/media/(?:v3|r0)/thumbnail/discord-media.mau.dev/stickers\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		return 307 https://media.discordapp.net/stickers/$1?$args;
	}
	location ~ ^/_matrix/media/(?:v3|r0)/thumbnail/discord-media.mau.dev/avatars\|([0-9]+)\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		return 307 https://media.discordapp.net/avatars/$1/$2?$args;
	}
}
```

</details>

### Proxy in reverse proxy
If you want bridged media to work over federation without MSC3860, you can
change discord-media.mau.dev to your own server name, and have your reverse proxy
actually proxy the downloads instead of just redirecting to cdn.discordapp.com.
That way it'll work with all existing servers and clients. The downside of this
method is the higher bandwidth use compared to redirecting, and theoretical
abuse vectors for spamming the Discord CDN through your server.

When using this example, change `discord-media.mau.dev/` in the patterns to
`example.com/discord_` (replacing `example.com` with your own domain). The
`discord_` prefix is there so that other media on your domain will still work
normally.

<details>
<summary>Caddy config example</summary>

```Caddyfile
matrix.example.com {
	handle /_matrix/media/*/download/example.com/discord_* {
		header Access-Control-Allow-Origin *
		# Remove path prefix
		uri path_regexp ^/_matrix/media/.+/download/example\.com/discord_ /
		# The mxc patterns use | instead of /, so replace it first turning it into attachments/1234/5678/filename.png
		uri replace "%7C" /
		reverse_proxy {
			# reverse_proxy automatically includes the uri, so no {uri} at the end
			to https://cdn.discordapp.com
			# Caddy doesn't set the Host header automatically when reverse proxying
			# (because usually reverse proxies are local and don't care about Host headers)
			header_up Host cdn.discordapp.com
		}
	}
	# Do the same for thumbnails, but redirect to media.discordapp.net (which is Discord's thumbnailing server, and happens to use similar width/height params as Matrix)
	# Alternatively, you can point this at cdn.discordapp.com too. Clients shouldn't mind even if they get a bigger image than they asked for.
	handle /_matrix/media/*/thumbnail/example.com/discord_* {
		header Access-Control-Allow-Origin *
		uri path_regexp ^/_matrix/media/.+/thumbnail/example\.com/discord_ /
		uri replace "%7C" /
		reverse_proxy {
			to https://media.discordapp.net
			header_up Host media.discordapp.net
		}
	}
	handle /_matrix/* {
		reverse_proxy http://localhost:8008
	}
}
```

</details>

<details>
<summary>TODO: Nginx config example</summary>
</details>
