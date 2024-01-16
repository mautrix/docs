# Authentication
0. Open a private chat with the bridge bot. Usually `@instagrambot:your.server` or `@facebookbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Send `login` to the bridge bot. The bot should ask you to paste cookies,
   which will happen in step 6.
2. Open the website (facebook.com or instagram.com) in a private window.
3. Open browser devtools, go to the network tab and filter for websocket
   requests only by clicking the "WS" button.
4. Log in normally.
5. Find the `chat` websocket request in devtools, right click it, choose
   "Copy" (Chrome) or "Copy Value" (Firefox), then "Copy as cURL".
   * Any request with the correct cookies should work, but websocket
     requests are the easiest to filter for.
   * You can also find the cookies manually and send them to the bot as a JSON object.
6. Paste the copied data to the bridge bot.
7. The bot should inform you of a successful login and sync recent chats.
