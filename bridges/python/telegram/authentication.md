# Authentication
## Logging in
As logging in requires you to send the phone code and possibly also your 2FA
password, make sure to run the commands in a management room (i.e. a room with
no other users than you and the appservice bot).

If you have 2-factor auth enabled or if you are logging in with a bot token, you
should use the web login, as otherwise the homeserver database will likely
contain your password/token in plaintext form.

0. Start a chat with the bridge bot (`@telegrambot:example.com` by default)
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Initiate the login process with `login`.
2. The bot should tell you to use the web interface or login in-Matrix. If you
   have enabled both login modes in the config, the bot will give you both
   options.
3. Choose the login method you want and follow the instructions under that
   heading, then go to the "Finally" section.

**N.B.** While the bridge uses the official client API, Telegram is known to
ban suspicious users, and a brand new account using a 3rd party client is
considered suspicious. Using a well-established account is perfectly safe.
If you do get banned, Telegram usually reverts incorrect bans fairly quickly
after emailing recover@telegram.org.

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

## Registering
Telegram officially discontinued registration from 3rd party clients as of
2023-02-18, so support for it was removed in v0.13.0 of the bridge. You should
sign up using a mobile client and then log into the bridge.

You can safely uninstall the mobile client after the bridge is logged in.
Telegram is not encrypted, so they don't have a concept of a primary device
like WhatsApp and Signal do.

## Logging out
Simply run the `logout` management command.
