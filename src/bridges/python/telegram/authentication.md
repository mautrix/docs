# Authentication
## Logging in
As logging in requires you to send the phone code and possibly also your 2FA
password, make sure to run the commands in a management room (i.e. a room with
no other users than you and the appservice bot).

If you have 2-factor auth enabled or if you are logging in with a bot token, you
should use the web login, as otherwise the homeserver database will likely
contain your password/token in plaintext form.

0. Start a chat with the bridge bot (`@telegrambot:example.com` by default)
1. Initiate the login process with `login`.
2. The bot should tell you to use the web interface or login in-Matrix. If you
   have enabled both login modes in the config, the bot will give you both
   options.
3. Choose the login method you want and follow the instructions under that
   heading, then go to the "Finally" section.

### In-Matrix login
4. Send your phone number to the room.
5. The bot should prompt you to send your auth code to the room: send it once it
   does.
6. If you have two-factor authentication enabled, again wait for the prompt and
   then send your password to the room.

### Web login
_New in version 0.2.0_

4. Click the link sent by the bot, enter your phone number and click "Request
   code".
5. Enter your code and click "Sign in".
6. If you have two-factor authentication enabled, enter your password and click
   "Sign in" again.

### Bot token
_New in version 0.3.0_

You can also log in with your own relay bot. This is more limited than real
accounts, but it means you can appear as yourself on Telegram without giving the
bridge access to your real account.

#### In-Matrix
4. Send your bot token to the room.

#### Web
4. Click the link sent by the bot and click "Use bot token".
5. Enter your bot token and click "Sign in".

---

**Finally:** If all went well, the bot should inform you of a successful login,
and the bridge should start creating portal rooms for all your Telegram groups
and invite you to them. The bridge won't automatically create rooms for private
chats: see "Private messages" at the bottom of [Creating and managing chats](./creating-and-managing-chats.md#private-messages)

## Double puppeting
_New in version 0.3.0_

_Changed in version 0.9.0: double puppeting is no longer limited to users on the
same homeserver as the bridge_

When you are logged in with your Telegram account, you can replace the Matrix
ghost of your Telegram account with your Matrix account. This is called
double-puppeting: the bridge will puppet (have control of) both your Telegram
account and your Matrix account. When you do so, messages that you send from
other Telegram clients will be sent from your Matrix account.

Also, in servers that don't support [MSC2409] (i.e. Synapse before v1.22), it is
the only way to enable bridging of ephemeral events, such as presence, typing
notifications and read receipts.

[MSC2409]: https://github.com/matrix-org/matrix-doc/pull/2409

Since version 0.7.0, you can also enable automatic double puppeting using shared
secret login (see [`bridge.login_shared_secret_map`], or [`bridge.login_shared_secret`]
before 0.9.0 in the config). This way the login is completely transparent to users.

[`bridge.login_shared_secret_map`]: https://github.com/tulir/mautrix-telegram/blob/v0.9.0/mautrix_telegram/example-config.yaml#L186-L194
[`bridge.login_shared_secret`]: https://github.com/tulir/mautrix-telegram/blob/v0.8.0/mautrix_telegram/example-config.yaml#L166-L171

1. Ask for login methods with `login-matrix`
2. Either send your access token to the room, or click the link sent by the bot
   and fill the login form.
3. After logging in, the default Matrix ghost of your Telegram account should
   leave rooms, and your account should join all rooms the ghost was in.

## Registering
_New in version 0.2.0_

As with login, you shouldn't register in a room with other users. Registering
via the web UI is not currently possible.

Please note that Telegram might not like users who register using 3rd party
clients. To avoid getting banned, it is recommended to register with a real
phone number (i.e. not an online SMS service) using an official client
(web/desktop/android/ios).

**Registration has not been tested, but it should work like this:**

1. Request a Telegram auth code with `register <phone number> <full name for Telegram>`
2. The bot should prompt you to send your auth code to the room: send it once it does.
3. The bot should inform you of a successful registration, after which you can
   join groups with your own name or start private chats.

## Logging out
Simply run the `logout` management command.
