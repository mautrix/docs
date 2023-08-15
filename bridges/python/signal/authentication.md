# Authentication
0. Open a private chat with the bridge bot. Usually `@signalbot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)

## Linking as secondary device
1. Go to "Linked Devices" in the Signal app settings and add a new device.
2. Send `link` to the bridge bot.
3. Scan the QR code the bridge sends you.

## Registering as the primary device
This method is strongly discouraged, as it's harder to recover if something
goes wrong, and you won't be able to migrate the registration when the bridge
is rewritten in Go. If you don't want to use the official signal apps, you
could use signal-cli to register and link the bridge to it.

<details>
<summary>Registration instructions</summary>

1. Send `register <phone>` to the bridge bot. The phone should be in the
   international format with no spaces.
2. Once you get the SMS verification code, send it to the bridge.
3. To be able to participate in v2 groups, set a profile name with
   `set-profile-name <name>`.

### CAPTCHA
Refer to the [signald docs](https://signald.org/articles/captcha/) on dealing
with captcha required errors. The bridge supports the same `--captcha`
parameter as signaldctl, but it must be passed before the phone number instead
of after (e.g. `!signal register --captcha signal-recaptcha-v2.03AOLTBLR... +12024561414`).
The `signalcaptcha://` prefix must *not* be included, but everything after it must be.

</details>
