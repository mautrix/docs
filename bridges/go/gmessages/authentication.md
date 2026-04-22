# Authentication
0. Open a private chat with the bridge bot. Usually `@gmessagesbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)

## Google account login
You may want to use [mautrix-manager](https://github.com/mautrix/manager)
instead of bot commands if you want to do Google login. It will automate
extracting cookies so you don't need to mess with browser devtools.

Note that Google Fi's "sync to your Google Account" option is not supported by
the bridge even with Google account login. You must choose the normal mode
where RCS chats are available (option 1 in <https://support.google.com/fi/answer/6188337>).

1. Send `login google` to start the login.
2. Log into <https://accounts.google.com/AccountChooser?continue=https://messages.google.com/web/config>
   with your Google account in a private window.
   * Using a private window is required to ensure the cookies don't get
     rotated by the bridge, and because the bridge doesn't support cookies
     linked to multiple accounts. If you don't use a private window, you'll
     likely get randomly logged out within an hour.
   * The `continue` URL in the link is chosen so that it would only log into
     your Google account and not try to pair the browser.
3. Make a key-value JSON object containing at least the `SID`, `HSID`, `SSID`,
   `OSID`, `APISID` and `SAPISID` cookies. Sometimes Google also requires
   `__Secure-1PSIDTS` to be included. Alternatively, you can copy a request
   with the cookies as cURL from the network tab and paste that to the bot
   (reloading the /web/config page and copying that request should work).
4. Send the JSON object or curl command to the bot.
5. Open Google Messages on your phone and tap on the emoji the bridge bot sent.
6. Finally, the bot should inform you of a successful login.

## QR login
This method was much easier to set up, but it appears Google has killed it :(

<details>
<summary>Old instructions</summary>

1. Send `login qr` to start the login.
2. Log in by scanning the QR code. If the code expires before you scan it, the
   bridge will send an error to notify you.
   1. On your phone, open <img src="./messages.svg" class="gm-icon" alt="" />
      Messages by Google.
   2. Tap Menu <img src="./menu.svg" class="gm-icon" alt="" />
      from your conversation list and select **Device pairing**.
   3. Tap **QR code scanner** and point your phone at the image sent by the bot.
3. Finally, the bot should inform you of a successful login.
   * The bridge will create portal rooms for recent chats. The number is
     configurable and defaults to 25 chats with 50 messages backfilled in each
     chat.

As all messages are proxied through the app, your phone must be connected to
the internet for the bridge to work.

</details>

## Logging out
Simply run the `logout` management command.

<style>
img.gm-icon {
  height: 24px;
  vertical-align: middle;
}
</style>
