# Authentication
You may want to use [mautrix-manager](https://github.com/mautrix/manager)
instead of bot commands. It will automate extracting cookies so you don't need
to mess with browser devtools.

0. Open a private chat with the bridge bot. Usually `@gmessagesbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Send `login` to start the login.
2. Log into <https://voice.google.com> with your Google account.
   * Using a private window is recommended to ensure the cookies don't get
     rotated by the bridge, and because the bridge doesn't support cookies
     linked to multiple accounts.
3. Make a key-value JSON object containing at least the `SID`, `HSID`, `SSID`,
   `OSID`, `APISID` and `SAPISID` cookies. Sometimes Google also requires
   `__Secure-1PSIDTS` to be included. Alternatively, you can copy a request
   with the cookies as cURL from the network tab and paste that to the bot.
4. Send the JSON object to the bot.
5. The bot should inform you of a successful login and bridge recent chats.

