# Relay mode
_New in version 0.2.0_

The bridge supports relaying messages for unauthenticated users through another
user's Signal account.

0. Enable relay mode by setting `bridge` → `relay` → `enabled` to `true`.
   Also make sure that the users you want to invite have at least the `relay`
   level in the `permissions` section.
1. Log into the bridge normally using the relaybot account.
   * If you want a separate Signal account for the relaybot while using your
     own account for your own Matrix user, you should make a dedicated Matrix
     account for the relaybot. If you do this, make sure to run the next
     command using the new Matrix account too.
2. Run `!signal set-relay` in the chats where you want to use the relaybot.
3. Use `!signal set-pl 100` to be able to modify room settings and invite
   others.

If you want to bridge existing rooms, you'll have to manually update the `mxid`
column in the `portal` table to point to the room you want bridged.

Note that reactions from relayed users will not be bridged to Signal at all,
because the bot wouldn't be able to bridge sender info nor multiple reactions
of the same emoji.
