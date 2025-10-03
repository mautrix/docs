# Authentication
You may want to use [mautrix-manager](https://github.com/mautrix/manager)
instead of bot commands. It will automate extracting cookies so you don't need
to mess with browser devtools.

0. Open a private chat with the bridge bot. Usually `@linkedinbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Send `login` to start the login.
2. Open the website in a private window and login normally.
3. Open browser devtools, go to the network tab, select "XHR" as the request
   type and search for `graphql`. Right click one of the requests and choose
   "Copy" (Chrome) or "Copy Value" (Firefox), then "Copy as cURL".
4. Paste the copied cURL string to the bot.
5. The bot should inform you of a successful login and bridge recent chats.

