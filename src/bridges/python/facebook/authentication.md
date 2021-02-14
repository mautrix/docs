# Authentication
0. Open a private chat with the bridge bot. Usually `@facebookbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Send `login <email> <password>`
2. If you have 2FA enabled, the bot will ask you to send the 2FA token.
3. Recent chats should now get portals automatically. Other chats will get
   portals as you receive messages.

Note that in some cases, Facebook might decide your account has suspicious
activity and block you until you do some tasks like adding a phone number or
resetting your password. In most cases, enabling two-factor authentication
solves this. If that doesn't help, hosting the bridge at home or making it proxy
all traffic through a residential IP can help further reduce suspiciousness.
The bridge can run separately from Synapse, e.g. on a Raspberry Pi. It can also
use the `http_proxy` environment variable for all Facebook traffic.
