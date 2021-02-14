# Double puppeting
You can replace the Matrix ghost of your remote account with your Matrix
account. When you do so, messages that you send from other clients will be sent
from your Matrix account instead of the default ghost user.

Also, in servers that don't support [MSC2409] (i.e. Synapse before v1.22), it is
the only way to enable bridging of ephemeral events, such as presence, typing
notifications and read receipts. All of my Python-based bridges support MSC2409.
However, mautrix-whatsapp does not, and therefore double puppeting is still the
only way to enable bridging of ephemeral events.

[MSC2409]: https://github.com/matrix-org/matrix-doc/pull/2409

## Manually
Double puppeting can only be enabled after logging into the bridge. As with
the normal login, you must do this in a private chat with the bridge bot.

1. Log in on the homeserver to get an access token, for example with the command
   ```shell
   $ curl -XPOST -d '{"type":"m.login.password","identifier":{"type": "m.id.user", "user": "example"},"password":"wordpass","initial_device_display_name":"a fancy bridge"}' https://example.com/_matrix/client/r0/login
   ```
   Alternatively, you can get an existing access token from your client
   (Settings -> Help & About in Element Web/Desktop). However, this means
   double puppeting will break if you log out of that client.
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

0. Set up [matrix-synapse-shared-secret-auth] on your Synapse.
1. Add the login shared secret to `bridge` → `login_shared_secret_map` in the
   config file under the correct server name.
   * In Go-based bridges (WhatsApp and iMessage) and in past versions of
     Python-based bridges, the field is called `login_shared_secret`, as double
     puppeting was only supported for local users.
2. The bridge will now automatically enable double puppeting for all local users
   when they log into the bridge.

[matrix-synapse-shared-secret-auth]: https://github.com/devture/matrix-synapse-shared-secret-auth
