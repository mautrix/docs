# Blocking invites
To use policy lists for blocking incoming invites, install the
[synapse-http-antispam] module, then configure it with the ID of the management
room you want to use plus the antispam API token from the Meowlnir config file:

[synapse-http-antispam]: https://github.com/maunium/synapse-http-antispam

```yaml
modules:
  - module: synapse_http_antispam.HTTPAntispam
    config:
      base_url: http://localhost:29339/_meowlnir/antispam/<management room ID>
      authorization: <value of antispam.secret>
      enabled_callbacks:
      - user_may_invite
      - user_may_join_room
      async:
        user_may_join_room: true
```

The `user_may_invite` callback is used to block invites from users who are
banned on any of the policy lists that the management room is subscribed to.

The `user_may_join_room` callback is used to track whether non-blocked invites
have been accepted. If `auto_reject_invites_token` is set in the config,
Meowlnir will automatically reject pending invites to rooms from banned users.
Even if this callback is not enabled, Meowlnir will still check whether the
invites are pending to avoid rejecting already-accepted invites.
