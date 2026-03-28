# Authentication
0. Open a private chat with the bridge bot. Usually `@telegrambot:your.server`
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)

## User login
**N.B.** While the bridge uses the official client API, Telegram is known to
ban suspicious users, and a brand new account using a 3rd party client is
considered suspicious. Using a well-established account is perfectly safe.
If you do get banned, Telegram usually reverts incorrect bans fairly quickly
after emailing recover@telegram.org.

### With 6-digit code
1. Send `login phone <your phone number>` to the bot where `<your phone number>`
   is in international format (`+123456789`).
2. Telegram will send you a 6-digit code to another Telegram client, which the
   bot will prompt you to send to the room.
   * Note: Telegram will not send the code over SMS. You need to have an
     official Telegram client already logged in to log into the bridge.
3. If you have a 2FA password, the bot will prompt you to send it to the room.

### With QR code
1. Go to Settings -> Devices in the Telegram app on your phone and tap "Link Desktop Device".
2. Send `login qr` to the bot.
3. Scan the QR code with your phone.
4. If you have a 2FA password, the bot will prompt you to send it to the room.

---

**Finally:** If all went well, the bot should inform you of a successful login,
and depending on the backfill and chat sync settings, the bridge should start
creating portal rooms for all your Telegram chats and invite you to them.

## Bot login
You can log into the bridge with a bot token for relaying, or if you just don't
want to use your real account with the bridge. Note that bots are more limited,
e.g. chats will only sync after receiving a message.

Also keep in mind that for relay mode, you should use a dedicated Matrix account,
not your main one, as explained in the [relay mode docs](../../general/relay-mode.md).

1. Send `login bot <your bot token>` to the bot where `<your bot token>` looks
   like `123456789:AABlmfCv0WOyqCxS15ACfvfBUZIqUWjLvM`.

## Registering
Telegram officially discontinued registration from 3rd party clients as of
2023-02-18, so support for it was removed in v0.13.0 of the bridge. You should
sign up using a mobile client and then log into the bridge.

You can safely uninstall the mobile client after the bridge is logged in.
Telegram is not encrypted, so they don't have a concept of a primary device
like WhatsApp and Signal do.
