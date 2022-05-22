# Authentication
0. Open a private chat with the bridge bot. Usually `@discordbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Send `login` to start the login.
2. Log in by scanning the QR code with a Discord mobile app.
   * After scanning the code, you'll need to approve the login on the mobile app.
     See the [official docs] for more info.
   * The app can be uninstalled afterwards.
3. Finally, the bot should inform you of a successful login.

Portal rooms are currently not created immediately. DM portals should be
created when you receive messages, and guild portals can be created using
`!discord guilds` commands.

[official docs]: https://support.discord.com/hc/en-us/articles/360039213771-QR-Code-Login-FAQ
