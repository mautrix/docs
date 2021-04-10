# Authentication
0. Open a private chat with the bridge bot. Usually `@signalbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)

## Linking as secondary device
1. Go to "Linked Devices" in the Signal app settings and add a new device.
2. Send `link` to the bridge bot.
3. Scan the QR code the bridge sends you.

## Registering as the primary device
1. Send `register <phone>` to the bridge bot. The phone should be in the
   international format with no spaces.
2. Once you get the SMS verification code, send it to the bridge.
3. To be able to participate in v2 groups, set a profile name with
   `set-profile-name <name>`.

Sometimes Signal requires solving a CAPTCHA when registering, but this is
currently not supported by the bridge.
