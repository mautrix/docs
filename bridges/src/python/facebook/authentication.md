# Authentication
0. Open a private chat with the bridge bot. Usually `@facebookbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)

## Web-based login
_New in version 0.2.1_

The bridge includes a web-based login interface to prevent the bridge and
homeserver from seeing your Facebook password. The web interface must be
enabled in the config to use this method ([`appservice`->`public`]).
After web login is enabled, send `login` with no parameters to the bridge bot,
click the link it gives, and use the login form on the website to log in.

[`appservice`->`public`]: https://github.com/tulir/mautrix-facebook/blob/9363c4541785a45e69b2f73d0bc5057ecb177619/mautrix_facebook/example-config.yaml#L36-L50

## In-Matrix login
1. Send `login <email>` to the bridge bot.
2. Send your password to the room.
3. If you have 2FA enabled, the bot will ask you to send the 2FA token.
4. Recent chats should now get portals automatically. Other chats will get
   portals as you receive messages.

---

Note that in some cases, Facebook might decide your account has suspicious
activity and block you until you do some tasks like adding a phone number or
resetting your password. In most cases, enabling two-factor authentication
solves this. If that doesn't help, hosting the bridge at home or making it proxy
all traffic through a residential IP can help further reduce suspiciousness.
The bridge can run separately from Synapse, e.g. on a Raspberry Pi. It can also
use the `http_proxy` environment variable for all Facebook traffic.
