# Authentication
0. Open a private chat with the bridge bot. Usually `@whatsappbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Send `login qr` to start the login.
   * To log in by entering a 8-letter code on your phone instead of scanning
     the QR code, use `login phone` instead and send your phone number when
     prompted.
   * In old versions of the bridge, just use `login` instead of `login qr`
     (and `login +123456789` for phone code login).
2. Log in by scanning the QR code or entering the pairing code. If the code
   expires before you scan it, the bridge will send an error to notify you.
   1. Open WhatsApp on your phone.
   2. Tap Menu <img src="./menu.svg" class="wa-menu-icon" alt=""/> or
      Settings <img src="./settings.svg" class="wa-menu-icon" alt=""/>
      and select Linked devices.
   3. Point your phone at the image sent by the bot to capture the code.
      * If logging in with pairing code, tap "Link with a phone number instead".
3. Finally, the bot should inform you of a successful login.
   * The bridge will start creating portal rooms approximately a minute after
     login. The amount of backfill can be configured before login, the default
     is to create portals for all chats from WhatsApp and backfill 50 messages
     in recent chats.

Please note that the bridge uses the web API. If the phone is offline for >2
weeks, linked devices will become disconnected:
<https://faq.whatsapp.com/general/download-and-installation/about-linked-devices>.
The bridge will warn you if it doesn't receive any data from the phone in over
12 days.

**N.B.** WhatsApp is known to ban accounts that are too suspicious. Just using
the bridge shouldn't cause any bans, but getting banned is more likely when
combining the bridge with other suspicious activity (running WhatsApp in an
Android emulator, using VoIP numbers, using a newly created account, initiating
DMs to non-contacts, etc).

## Logging out
Simply run the `logout` management command.

<style>
img.wa-menu-icon {
  vertical-align: middle;
}
</style>
