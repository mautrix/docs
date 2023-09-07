# Authentication
0. Open a private chat with the bridge bot. Usually `@whatsappbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)
1. Send `login` to start the login.
   * _New in version 0.10.1:_ To log in by entering a 8-letter code on your
     phone instead of scanning the QR code, pass your phone number after the
     command, e.g. `login +123456789`.
2. Log in by scanning the QR code or entering the pairing code. If the code
   expires before you scan it, the bridge will send an error to notify you.
   1. Open WhatsApp on your phone.
   2. Tap Menu <img src="./menu.svg" class="wa-menu-icon" alt=""/> or
      Settings <img src="./settings.svg" class="wa-menu-icon" alt=""/>
      and select Linked devices.
   3. Point your phone at the image sent by the bot to capture the code.
      * If logging in with pairing code, tap "Link with a phone number instead".
3. Finally, the bot should inform you of a successful login.
   * If backfilling  was enabled before logging in, portal rooms should start
     being created approximately a minute after login.

Please note that the bridge uses the web API. Prior to v0.2.0 and the multidevice
update, your phone had to be connected to the internet for the bridge to work.
After v0.2.0, it's enough if the phone is connected at least once every 2 weeks.
If the phone is offline for >2 weeks, linked devices will become disconnected:
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
