# Authentication
0. Open a private chat with the bridge bot. Usually `@twitterbot:your.server`.
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Log into [Twitter](https://twitter.com) in a private browser window.
2. Send `login-cookie` to start the login.
3. The bot will send you these instructions to extract required cookies.
   Follow the steps to log into the bridge:
   1. Press `F12` to open developer tools.
   2. Select the "Application" (Chrome) or "Storage" (Firefox) tab.
   3. In the sidebar, expand "Cookies" and select `https://twitter.com`.
   4. In the cookie list, find the `auth_token` row and double click on the
      value then copy the value and send it to the room.
   5. Repeat the previous step with the `ct0` row.
4. Recent chats should now get portals automatically. Other chats will get
   portals as you receive messages.
