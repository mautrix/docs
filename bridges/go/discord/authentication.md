# Authentication
0. Open a private chat with the bridge bot. Usually `@discordbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Follow one of the three instructions below.

## QR login
QR login is more convenient, but requires having the Discord mobile app
installed, and may encounter CAPTCHAs which are currently not supported by the
bridge.

1. Send `login-qr` to start the login.
2. Log in by scanning the QR code with a Discord mobile app.
   * After scanning the code, you'll need to approve the login on the mobile app.
     See the [official docs] for more info.
   * The app can be uninstalled afterwards.
3. If you encounter a bad request error saying something about a captcha,
   you'll have to use token login. Otherwise the login should be successful.

[official docs]: https://support.discord.com/hc/en-us/articles/360039213771-QR-Code-Login-FAQ

## Token login
You can also log in by logging in manually and providing the access token to
the bridge.

1. Log in to Discord in a browser. A private window is recommended so you can
   easily make the browser forget the token without invalidating it.
2. Press <kbd>F12</kbd> (or <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> on Mac)
   to open developer tools.
3. Select the "Network" tab and filter for `api`.
4. Press <kbd>F5</kbd> (or <kbd>Cmd</kbd>+<kbd>R</kbd> on Mac) to reload the page.
5. Pick any successful request (e.g. the `library` request). Scroll down to
   "Request Headers" and find the `Authorization` header. Right-click the entry
   and choose copy value.
7. Send `login-token user <token>` to the bot
   (replacing `<token>` with the copied value).
8. (Close the private window)

## Bot token login
If you don't want to use a real account, you can also log in as a bot.

1. Create an application on <https://discord.com/developers/applications>.
2. In the "Bot" section, add a bot and copy the token.
3. Enable "server members intent" and "message content intent" under the
   "Privileged Gateway Intents" section.
4. Send `login-token bot <token>`
5. To add your bot to a guild, go to OAuth2 -> URL Generator, select "bot"
   under scopes and select the permissions to grant. The generated URL can then
   be used to add the bot to a guild.
   * At least "Send Messages", "Create Public Threads", "Send Messages in
     Threads", "Read Message History" and "Add Reactions" are recommended.
   * If you're the guild admin, you can just choose "Administrator" for the
     bot and not worry about exact permissions.

---

After a successful login, the bridge will create portals for some recent DMs
(some is defined by `startup_private_channel_create_limit` in the bridge config).
To bridge guilds, use the `guilds` command.
