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
   * For most use cases, you will want a dedicated Matrix account for the login
     rather than doing it on your main account. See the "Shared relays" section
     below for details.
2. Run `!prefix set-relay` in the chats where you want to use the relaybot,
   replacing `!prefix` with the appropriate command prefix for the bridge,
   like `!signal` or `!wa`. You can also use `set-relay <login ID>` to choose
   a specific login to be the relay (use `list-logins` to find login IDs).
3. Use `!prefix set-pl 100` to be able to modify room settings and invite
   others.

Note that reactions from relayed users will not be bridged at all, because the
bot wouldn't be able to bridge sender info nor multiple reactions of the same
emoji.

## Shared relays
Relays are only used for users who have *not* logged into the bridge (or whose
logins are not present in the room). This means that the user who is marked as
a relay won't use the relay themselves. Instead, their messages will be sent
without the displayname prefix that relayed users get.

If you want everyone to be relayed, you should make a dedicated Matrix account
that will run the `login` command. A dedicated Matrix account in this context
means a normal new Matrix user. It is not related to the bridge bot or any other
bridge-managed account in any way. If you want relay bridges to multiple
different chat networks, you can safely share the dedicated relay account
between all bridges.

By default, only admins can set relays. If you want to set up a shared relay
account that anyone can enable, add the login ID (from `list-logins`) to the
`default_relays` list in the config after logging in. Alternatively, you can
set `admin_only` to `false` to allow anyone to set themselves as a relay.

## Bridging existing rooms
If you want to bridge existing rooms, you can use the `!prefix bridge` command
in v26.04 and up.

The `bridge` command takes one or two parameters: first optionally the login ID
to use and second the internal chat ID on the remote network. If a login ID is
not provided, the command will use either the sender's default login, or the
first valid login in the `default_relays` config.

You may also want to add the relay login IDs to `bridge` → `portal_create_filter`
→ `always_deny_from_login` in order to prevent automatic portal room creation.
If a portal room is already created, a bridge admin or room admin in the existing
portal is required to unbridge it.

When the command is used with a login listed in `default_relays`, it will
automatically apply `set-relay` as well.

Note: if `relay` → `allow_bridge` is set to `false`, then default relays will
not be used.

## Legacy bridges
Some of the legacy bridges that haven't been rewritten as Megabridges yet have
slightly different system. In particular

* Telegram's Python version (pre-v26.04) has [relay bots](https://github.com/mautrix/docs/blob/95395dff46e6468750c1625cbb741c866f0d98a2/bridges/python/telegram/relay-bot.md)
* Discord has [relay webhooks](../go/discord/relay.md)
* iMessage doesn't require using `set-relay`, enabling it in the config will
  enable relay in all chats.
* Google Chat doesn't support relay mode at all
