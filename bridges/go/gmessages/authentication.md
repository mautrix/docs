# Authentication
0. Open a private chat with the bridge bot. Usually `@gmessagesbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Send `login` to start the login.
2. Log in by scanning the QR code. If the code expires before you scan it, the
   bridge will send an error to notify you.
   1. On your phone, open <img src="./messages.svg" class="gm-icon" alt="" />
      Messages by Google.
   2. Tap Menu <img src="./menu.svg" class="gm-icon" alt="" />
      from your conversation list and select **Device pairing**.
   3. Tap **QR code scanner** and point your phone at the image sent by the bot.
3. Finally, the bot should inform you of a successful login.
   * If backfilling  was enabled before logging in, portal rooms should start
     being created approximately a minute after login.

As all messages are proxied through the app, your phone must be connected to
the internet for the bridge to work.

## Logging out
Simply run the `logout` management command.

<style>
img.gm-icon {
  vertical-align: middle;
}
</style>
