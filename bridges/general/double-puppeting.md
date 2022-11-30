# Double puppeting
You can replace the Matrix ghost of your remote account with your Matrix
account. When you do so, messages that you send from other clients will be sent
from your Matrix account instead of the default ghost user. In most of the
bridges, this is necessary to bridge DMs you send from other clients to Matrix.

Also, in servers that don't support [MSC2409] (i.e. Synapse before v1.22), it is
the only way to enable bridging of ephemeral events, such as presence, typing
notifications and read receipts. If you want to use MSC2409 for ephemeral
events, make sure `appservice` -> `ephemeral_events` is set to `true` in the
bridge config and that the registration file has the appropriate flags too
(you can regenerate the registration after updating the bridge config).

[MSC2409]: https://github.com/matrix-org/matrix-doc/pull/2409

## Manually
Double puppeting can only be enabled after logging into the bridge. As with
the normal login, you must do this in a private chat with the bridge bot.

**N.B.** This method is not supported in mautrix-imessage, as it does not
currently support any commands.

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

## Automatically
Instead of requiring everyone to manually enable double puppeting, you can give
the bridge access to log in on its own. This makes the process much smoother for
users, and removes problems if the access token getting invalidated, as the
bridge can simply automatically relogin.

This method requires administrator access to the homeserver, so it can't be used
if your account is on someone elses server (e.g. using self-hosted bridges from
matrix.org). In such cases, manual login is the only option.

### Shared secret method

0. Set up [matrix-synapse-shared-secret-auth] on your Synapse.
   * Make sure you set `m_login_password_support_enabled` to `true` in the config.
1. Add the login shared secret to `bridge` → `login_shared_secret_map` in the
   config file under the correct server name.
   * In mautrix-imessage and in past versions of other bridges, the field is
     called `login_shared_secret`, as double puppeting was only supported for
     local users.
2. The bridge will now automatically enable double puppeting for all users on
   servers with a shared secret set when they log into the bridge.

[matrix-synapse-shared-secret-auth]: https://github.com/devture/matrix-synapse-shared-secret-auth

### Appservice method
This is more experimental and can have other side-effects. Additionally, it only
works for users who are on the same homeserver as the bridge, it can't be used
with other homeservers at all (even with admin access).

The benefit of this method is that [appservice login] is in the spec, so it can
work on all homeserver implementations (caveat: as of writing, [Dendrite] and
[Conduit] do not implement the spec).

[appservice login]: https://spec.matrix.org/v1.5/client-server-api/#appservice-login
[Dendrite]: https://github.com/matrix-org/dendrite/issues/2723
[Conduit]: https://gitlab.com/famedly/conduit/-/issues/321

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
