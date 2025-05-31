# Report interception
Meowlnir can intercept reports from local users for either notifying the admins,
or processing commands from the admins.

To use it, you must proxy the report endpoints to Meowlnir (see
[Reverse proxy configuration](./reverse-proxy.md)) and define a `report_room` in
the Meowlnir config file. Reports from local users sent using the report button
in clients will then send notices to the specified room. The room must be a
management room (defined using the `PUT .../management_room/...` endpoint in the
Meowlnir API).

Users who are admins in the management room can also send commands to Meowlnir
via the report feature. Currently, the only existing command is `/ban`, which
can be used to send a ban policy event.

To ban a user, report one of their messages and type `/ban <list> <reason>`
as the report reason. Meowlnir will then find the policy list whose shortcode is
`<list>` and send a ban policy with `<reason>` as the reason.
