# Authentication
0. Open a private chat with the bridge bot. Usually `@whatsappbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Send `login` to start the login.
2. Log in by scanning the QR code. If the code expires before you scan it, the
   bridge will send an error to notify you.
   1. Open WhatsApp on your phone.
   2. Tap Menu <img src="./menu.svg" class="wa-menu-icon" alt=""/> or Settings <img src="./settings.svg" class="wa-menu-icon" alt=""/>
      and select Linked devices.
   3. Point your phone at the image sent by the bot to capture the code.
3. Finally, the bot should inform you of a successful login and the bridge
   should start creating portal rooms for your recent WhatsApp groups and
   private chats.

Please note that the bridge uses the web API. Prior to v0.2.0 and the multidevice
update, your phone had to be connected to the internet for the bridge to work.
After v0.2.0, it's enough if the phone is connected at least once every 2 weeks.

## Logging out
Simply run the `logout` management command.

<style>
img.wa-menu-icon {
  vertical-align: middle;
}
</style>
