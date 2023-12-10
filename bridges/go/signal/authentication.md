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
Registering as the primary device is no longer supported. If you don't want to
use the official signal apps, you could use [signal-cli] to register and link
the bridge to it.

[signal-cli]: https://github.com/AsamK/signal-cli
