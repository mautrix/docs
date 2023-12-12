# Double puppeting
You can replace the Matrix ghost of your remote account with your Matrix
account. When you do so, messages that you send from other clients will be sent
from your Matrix account instead of the default ghost user. In most of the
bridges, this is necessary to bridge DMs you send from other clients to Matrix.

Benefits of double puppeting:

* Automatically accept invites to new chats.
* Bridge messages you send from the native app in direct chats.
* Bridge messages you send from the native app as your Matrix real user instead
  of the bridge's ghost user.
* Optionally sync some details like low priority, favorites, mute status
  and [direct chat status](https://docs.mau.fi/bridges/general/troubleshooting.html#why-are-direct-messages-showing-up-under-rooms-instead-of-people).

## Automatically
Instead of requiring everyone to manually enable double puppeting, you can give
the bridge access to log in on its own. This makes the process much smoother for
users, and removes problems if the access token getting invalidated, as the
bridge can simply automatically relogin.

This method requires administrator access to the homeserver, so it can't be used
if your account is on someone elses server (e.g. using self-hosted bridges from
matrix.org). In such cases, manual login is the only option.

### Appservice method (new)
**N.B.** This method is not supported in the legacy (Python) Signal bridge nor
the current iMessage and Slack bridges. You can use the alternative methods like
shared secret login documented below for those.

This method doesn't log in at all, instead it uses an `as_token` directly with
the `user_id` query parameter. It should work on all homeserver implementations
that support appservices. However, some servers don't follow the spec, and may
not work with a null `url` field. This method also makes timestamp massaging
work correctly and disables ratelimiting for double puppeted messages.

Since there's no login step, this method also has the benefit of not adding
confusing sessions to the session list visible to the user.

1. First create a new appservice registration file. Don't touch the bridge's
   main registration file, and make sure the ID and as/hs tokens are different
   (having multiple appservices with the same ID or as_token isn't allowed).

   ```yaml
   # The ID doesn't really matter, put whatever you want.
   id: doublepuppet
   # The URL is intentionally left empty (null), as the homeserver shouldn't
   # push events anywhere for this extra appservice. If you use a
   # non-spec-compliant server, you may need to put some fake URL here.
   url:
   # Generate random strings for these three fields. Only the as_token really
   # matters, hs_token is never used because there's no url, and the default
   # user (sender_localpart) is never used either.
   as_token: random string
   hs_token: random string
   sender_localpart: random string
   # Bridges don't like ratelimiting. This should only apply when using the
   # as_token, normal user tokens will still be ratelimited.
   rate_limited: false
   namespaces:
     users:
     # Replace your\.domain with your server name (escape dots for regex)
     - regex: '@.*:your\.domain'
       # This must be false so the appservice doesn't take over all users completely.
       exclusive: false
   ```
2. Install the new registration file the usual way
   (see [Registering appservices]).
3. Finally set `as_token:$TOKEN` as the secret in `login_shared_secret_map`
   (e.g. if you have `as_token: meow` in the registration, set `as_token:meow`
   in the bridge config).
   ```yaml
   bridge:
     ...
     login_shared_secret_map:
       your.domain: "as_token:meow"
     ...
   ```

If you set up double puppeting for multiple bridges, you can safely reuse the
same registration by just setting the same token in the config of each bridge
(i.e. no need to create a new double puppeting registration for each bridge).

This method works for other homeservers too, you just have to create a new
registration file for each server, add the token to `login_shared_secret_map`,
and also add the server address to `double_puppet_server_map` (for the bridge
server, adding to the server map is not necessary as it defaults to using the
one configured in `homeserver` -> `address`).

[Registering appservices]: https://docs.mau.fi/bridges/general/registering-appservices.html

<details>
<summary><h3>Shared secret method (legacy, synapse-only)</h3></summary>

0. Set up [matrix-synapse-shared-secret-auth] on your Synapse.
   * Make sure you set `m_login_password_support_enabled` to `true` in the config.
   * You should also set `com_devture_shared_secret_auth_support_enabled` to
     `false` as having that option enabled breaks user-interactive auth in some
     clients (e.g. you won't be able to sign out other devices or reset
     cross-signing in Element).
1. Add the login shared secret to `bridge` → `login_shared_secret_map` in the
   config file under the correct server name.
   * In mautrix-imessage and in past versions of other bridges, the field is
     called `login_shared_secret`, as double puppeting was only supported for
     local users.
2. The bridge will now automatically enable double puppeting for all users on
   servers with a shared secret set when they log into the bridge.

[matrix-synapse-shared-secret-auth]: https://github.com/devture/matrix-synapse-shared-secret-auth

</details>
<details>
<summary><h3>Appservice method (legacy, deprecated)</h3></summary>

**This method is not recommended.** Doing this causes all events from rooms
your user is in to be pushed to the bridge, which then makes the bridge bot
join the rooms (as the bridge assumes it only receives events meant for it).

Additionally, it only works for users who are on the same homeserver as the
bridge, it can't be used with other homeservers at all (even with admin access).

1. Modify the registration file to add a user namespace covering all users
   in addition to the `bridge_.+` and `bridgebot` regexes. Make sure you set
   `exclusive: false` for the new regex.

   ```yaml
   namespaces:
     users:
     - ...existing regexes...
     - regex: '@.*:your\.domain'
       exclusive: false
   ```

   Restart the homeserver after modifying the registration.

2. Set the shared secret in the bridge config to `appservice`:
   ```yaml
   bridge:
     ...
     login_shared_secret_map:
       your.domain: appservice
     ...
   ```
3. The bridge will now use appservice login enable double puppeting for all
   local users when they log into the bridge.

</details>

## Manually
Double puppeting can only be enabled after logging into the bridge. As with
the normal login, you must do this in a private chat with the bridge bot.

**N.B.** This method is not currently supported in mautrix-imessage and mautrix-slack.

1. Log in on the homeserver to get an access token, for example with the command
   ```shell
   $ curl -XPOST -d '{"type":"m.login.password","identifier":{"type": "m.id.user", "user": "example"},"password":"wordpass","initial_device_display_name":"a fancy bridge"}' https://example.com/_matrix/client/v3/login
   ```
   You may want to change the `initial_device_display_name` field to something
   more descriptive, or rename it from another client after logging in.
   * In the past, getting a token from an existing client like Element was the
     recommended easy way. However, multiple clients using the same token can
     cause issues with encryption, so doing that is no longer allowed.
2. Send `login-matrix <access token>` to the bridge bot. For the Telegram
   bridge, send `login-matrix` without the access token, then send the access
   token in a separate message.
3. After logging in, the default Matrix ghost of your remote account should
   leave rooms and your account should join all rooms the ghost was in
   automatically.

### Manually with SSO

If you only have SSO login on your homeserver, the above example with password
login won't work. However, doing SSO login manually is still possible, just a
bit more work.

1. Open `https://example.com/_matrix/client/v3/login/sso/redirect/?redirectUrl=http://localhost:12345`
   in a browser. The redirect URL at the end doesn't have to be a real server,
   since you can just copy the relevant value in the browser URL bar after the
   redirect.
2. Go through the SSO process, then once it redirects to localhost:12345, copy
   the value of the `loginToken` query parameter.
3. Log into the homeserver with the login token:
   ```shell
   $ curl -XPOST -d '{"type":"m.login.token","token":"THE TOKEN","initial_device_display_name":"a fancy bridge"}' https://example.com/_matrix/client/v3/login
   ```
4. Follow steps 2 and 3 of the normal password login instructions.
