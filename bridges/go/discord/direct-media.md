# Direct media access (v2)
_New in version 0.7.0_

To avoid spamming your homeserver's media repository with all files from
Discord, the bridge has an option to generate fake `mxc://` URIs that contain
the Discord message ID and some other info. To make the URIs work, the bridge
effectively turns into a media-only homeserver.

For example, if your main Matrix server is `example.com`, you could set up
`discord-media.example.com` as the bridge's server name. The way to do that
is to either proxy the subdomain to the bridge entirely, or create a
`.well-known/matrix/server` file (just like normal homeserver setups) pointing
somewhere else where the bridge is listening.

When proxying the subdomain entirely, port 443 is enough, the bridge will
automatically serve a .well-known to redirect from port 8448 to 443.

Endpoints that the bridge can handle with direct media access:

* `/_matrix/media/*`
* `/_matrix/key/*`
* `/_matrix/federation/v1/version`
* `/.well-known/matrix/server`

To enable direct media access:

* Set `bridge` -> `direct_media` -> `enabled` to `true`.
* Change the `server_name` field to a (sub)domain where the aforementioned
  endpoints are proxied to the bridge.
* Ensure `server_key` is set.
  * The bridge generates one automatically on startup and writes it back to the
    config. If you prevented the bridge from writing the config, you'll have to
    set it yourself so it wouldn't generate a new one on every restart.

## Legacy direct media access
In the past, the bridge supported specifying templates that a simple reverse
proxy could parse to redirect the request to Discord's CDN. However, that
method no longer works since Discord started requiring signed URLs that expire.

<details>
<summary>Old docs</summary>

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

MSC3860 is supported as of Synapse v1.98.0 and matrix-media-repo v1.4.0.
Additionally, while Conduit doesn't opt into redirects, it does follow them,
so it should work with the default config.

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
federated rooms. Additionally, you may encounter some CORS issues with this
method as cdn.discordapp.com doesn't provide CORS headers for all files (like
webp images and non-inline documents)

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
	# N.B. If you use a regex pattern for the /_matrix block, it must be below these locations

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
<summary>Nginx config example</summary>

```nginx
server {
	listen 443;
	server_name matrix.example.com;
	# ... usual /_matrix location block and other stuff ...
	# N.B. If you use a regex pattern for the /_matrix block, it must be below these locations

	# You may need to configure a resolver for nginx to be able to resolve cdn.discordapp.com
	#resolver 8.8.8.8;

	location ~ ^/_matrix/media/(?:v3|r0)/download/example.com/discord_attachments\|([0-9]+)\|([0-9]+)\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		proxy_set_header Host cdn.discordapp.com;
		proxy_pass https://cdn.discordapp.com/attachments/$1/$2/$3;
	}
	location ~ ^/_matrix/media/(?:v3|r0)/download/example.com/discord_emojis\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		proxy_set_header Host cdn.discordapp.com;
		proxy_pass https://cdn.discordapp.com/emojis/$1;
	}
	location ~ ^/_matrix/media/(?:v3|r0)/download/example.com/discord_stickers\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		proxy_set_header Host cdn.discordapp.com;
		proxy_pass https://cdn.discordapp.com/stickers/$1;
	}
	location ~ ^/_matrix/media/(?:v3|r0)/download/example.com/discord_avatars\|([0-9]+)\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		proxy_set_header Host cdn.discordapp.com;
		proxy_pass https://cdn.discordapp.com/avatars/$1/$2;
	}

	# Thumbnails (optional-ish)
	location ~ ^/_matrix/media/(?:v3|r0)/thumbnail/example.com/discord_attachments\|([0-9]+)\|([0-9]+)\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		proxy_set_header Host media.discordapp.net;
		proxy_pass https://media.discordapp.net/attachments/$1/$2/$3?$args;
	}
	location ~ ^/_matrix/media/(?:v3|r0)/thumbnail/example.com/discord_emojis\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		proxy_set_header Host media.discordapp.net;
		proxy_pass https://media.discordapp.net/emojis/$1?$args;
	}
	location ~ ^/_matrix/media/(?:v3|r0)/thumbnail/example.com/discord_stickers\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		proxy_set_header Host media.discordapp.net;
		proxy_pass https://media.discordapp.net/stickers/$1?$args;
	}
	location ~ ^/_matrix/media/(?:v3|r0)/thumbnail/example.com/discord_avatars\|([0-9]+)\|(.+)$ {
		add_header Access-Control-Allow-Origin *;
		proxy_set_header Host media.discordapp.net;
		proxy_pass https://media.discordapp.net/avatars/$1/$2?$args;
	}
}
```

</details>
</details>
