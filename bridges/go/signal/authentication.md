# Authentication
0. Open a private chat with the bridge bot. Usually `@signalbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)

## Linking as secondary device
1. Go to "Linked Devices" in the Signal app settings and add a new device.
2. Send `login` to the bridge bot.
3. Scan the QR code the bridge sends you.
4. Finally, the bot should inform you of a successful login.
   * Chats will not be immediately bridged currently, they will be bridged
     as you receive messages.
   * Signal does not support any kind of message history (even on official apps),
     so the bridge won't backfill any messages.

## Registering as the primary device
Registering as the primary device is no longer supported directly in the bridge.
Using an official mobile app is recommended. However, if you don't want to use
those, [signal-cli] works quite well too.

[signal-cli]: https://github.com/AsamK/signal-cli

<details>
<summary>signal-cli instructions</summary>

1. Download the latest release of signal-cli.
2. Run `signal-cli -u +123456789 register`
3. Go to <https://signalcaptchas.org/registration/generate.html> to generate a
   captcha code.
   * The page will redirect you to a `signalcaptcha://` URI after solving the
     captcha. At least on Firefox, you need to have the devtools console open
     to be able to see and copy the URI.
   * Alternatively, you can wait for a few seconds for the "Open Signal" button
     to appear, then right click on it and copy the link.
4. Run `signal-cli -u +123456789 register --captcha 'signalcaptcha://signal-hcaptcha...'`
   with the generated captcha code.
5. Run `signal-cli -u +123456789 verify 123456`
   (123456 being the code sent over SMS).
6. Send `login` to the bridge bot.
7. Run `signal-cli -u +123456789 addDevice --uri 'sgnl://...'` with the URI
   returned by the bridge bot.
8. The bot should inform you of a successful login.
9. Run `signal-cli -u +123456789 receive` occasionally to make sure the
   registration remains active.

</details>
