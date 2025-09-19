# Relay mode
All megabridges support relay mode with the same mechanism: a specific login
can be designated as a relay, which will be used for bridging messages from
users who haven't logged into the bridge.

0. Enable relay mode by setting `bridge` → `relay` → `enabled` to `true` in the
   bridge config. Also make sure that the users you want to invite have at
   least the `relay` level in the `permissions` section.
   * By default, `admin_only` is true, which means only bridge admins (as
     defined by the `permissions` section) can set a relay. If you want room
     admins to also be able to set themselves as a relay, set `admin_only` to
     `false`.
1. Log into the bridge normally using the relaybot account.
   * If you want a separate remote account for the relaybot while using your
     own account for your own Matrix user, you should make a dedicated Matrix
     account for the relaybot. If you do this, make sure to run the next
     command using the new Matrix account too.
   * Using the same dedicated account for multiple bridges is fine, so you can
     have a server-wide "relay" account that acts as the relay for all the
     bridges.
   * By default, admins can set any login as a relay, while non-admins can only
     set themselves as a relay. If you want to set up a shared relay account
     that anyone can enable, add the login ID (from `list-logins`) to the
     `default_relays` list in the config after logging in.
2. Run `!prefix set-relay` in the chats where you want to use the relaybot,
   replacing `!prefix` with the appropriate command prefix for the bridge,
   like `!signal` or `!wa`. You can also use `set-relay <login ID>` to choose
   a specific login to be the relay (use `list-logins` to find login IDs).
3. Use `!prefix set-pl 100` to be able to modify room settings and invite
   others.

If you want to bridge existing rooms, you'll have to manually update the `mxid`
column in the `portal` table to point to the room you want bridged.

Note that reactions from relayed users will not be bridged at all, because the
bot wouldn't be able to bridge sender info nor multiple reactions of the same
emoji.

## Legacy bridges
Some of the legacy bridges that haven't been rewritten as Megabridges yet have
slightly different system. In particular

* Telegram has [relay bots](../python/telegram/relay-bot.html)
* Discord has [relay webhooks](../go/discord/relay.md)
* iMessage doesn't require using `set-relay`, enabling it in the config will
  enable relay in all chats.
* Google Chat doesn't support relay mode at all
