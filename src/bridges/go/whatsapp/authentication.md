# Authentication
0. Open a private chat with the bridge bot. Usually `@whatsappbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
2. Send `login` to start the login.
3. Log in by scanning the QR code. If the code expires before you scan it, the
   bridge will send an error to notify you.
   1. Open WhatsApp on your phone.
   2. Tap Menu or Settings and select WhatsApp Web.
   3. Point your phone at the image sent by the bot to capture the code.
4. Finally, the bot should inform you of a successful login and the bridge
   should start creating portal rooms for your recent WhatsApp groups and
   private chats.

Please note that the bridge uses the web API, so your phone must be connected to
the internet for the bridge to work. The WhatsApp app doesn't need to be running
all the time, but it needs to be allowed to wake up when receiving messages. The
web API is used instead of the main client API to avoid getting banned.

## Logging out
Simply run the `logout` management command.
