# Authentication
0. Open a private chat with the bridge bot. Usually `@ircbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Make sure you the network you want is listed in the bridge config.
2. Send `login` to start the login.
3. Enter the name of the network you want to log into.
   The name must match a key in the `networks` map in the config.
4. Enter the nick you want to use.
5. If you want to log into NickServ, enter the username and password to use for
   SASL separated by a colon, i.e. `username:password`. If you don't want to
   authenticate, just send a colon `:`
6. The bot should inform you of a successful login and will start connecting to IRC.
   The connection may fail after a successful login if the configuration or
   credentials are incorrect.
