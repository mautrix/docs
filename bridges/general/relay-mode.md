# Relay mode
Some of the bridges here support relaying messages for unauthenticated users
through the account that another Matrix user is logged in as.

0. Enable relay mode by setting `bridge` → `relay` → `enabled` to `true` in the
   bridge config. Also make sure that the users you want to invite have at
   least the `relay` level in the `permissions` section.
1. Log into the bridge normally using the relaybot account.
   * If you want a separate remote account for the relaybot while using your
     own account for your own Matrix user, you should make a dedicated Matrix
     account for the relaybot. If you do this, make sure to run the next
     command using the new Matrix account too.
   * Using the same dedicated account for multiple bridges is fine, so you can
     have a server-wide "relay" account that acts as the relay for all the
     bridges.
2. Run `!prefix set-relay` in the chats where you want to use the relaybot.
   (replace `!prefix` with the appropriate command prefix for the bridge,
   like `!signal` or `!wa`)
3. Use `!prefix set-pl 100` to be able to modify room settings and invite
   others.

If you want to bridge existing rooms, you'll have to manually update the `mxid`
column in the `portal` table to point to the room you want bridged.

Note that reactions from relayed users will not be bridged at all, because the
bot wouldn't be able to bridge sender info nor multiple reactions of the same
emoji.

## Support table
Minimum bridge versions that support the relay system documented above.

| Bridge          | Version                                               |
|-----------------|-------------------------------------------------------|
| Telegram        | [Different system](../python/telegram/relay-bot.html) |
| WhatsApp        | 0.2.0                                                 |
| Signal          | 0.2.0                                                 |
| Instagram       | 0.1.2                                                 |
| Facebook        | 0.3.3                                                 |
| Meta            | 0.1.0                                                 |
| Google Chat     | not yet supported                                     |
| Twitter         | not yet supported                                     |
| Google Messages | not yet supported                                     |
| iMessage        | †0.1.0/[3df789e2]                                     |
| Discord         | [Different system](../go/discord/relay.md)            |
| Slack           | not yet supported (will likely use different system)  |

† iMessage doesn't require `set-relay`, relay mode is enabled in all chats
  automatically if enabled in the config. The `permissions` section is replaced
  with `relay` -> `whitelist`.

[3df789e2]: https://github.com/mautrix/imessage/commit/3df789e24b8500d95a53d5417aca6e59bedf7efd
