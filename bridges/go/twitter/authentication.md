# Authentication
You may want to use [mautrix-manager](https://github.com/mautrix/manager)
instead of bot commands. It will automate extracting cookies so you don't need
to mess with browser devtools.

0. Open a private chat with the bridge bot. Usually `@twitterbot:your.server`.
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Log into [Twitter](https://twitter.com) in a private browser window.
   1. Press <kbd>F12</kbd> to open developer tools.
   2. Select the "Application" (Chrome) or "Storage" (Firefox) tab.
   3. In the sidebar, expand "Cookies" and select `https://twitter.com`.
   4. In the cookie list, find the values for `ct0` and `auth_token`.
2. Send `login ct0 auth` to the bot (replacing `ct0` and `auth` with the
   respective values).
3. Recent chats should now get portals automatically. Other chats will get
   portals as you receive messages.
