# Configuring bots
After you've created a bot and assigned at least one management room, you'll
need to configure the bot in the management room to tell it which rooms to
protect and which policy lists to watch. All such configuration is stored in
room state events, which is what allows you to have different sets of configs by
having multiple management rooms.

## Subscribing to policy lists
The `fi.mau.meowlnir.watched_lists` state event is used to subscribe to policy
lists. The state key must be empty and the content must have a `lists` key,
which is a list of objects. Each object must contain `room_id`, `shortcode` and
`name`, and may specify certain extra flags (documented below).

You can also use the `!lists subscribe <room ID or alias> [shortcode]` command
instead of sending the state event manually.

For example, the event below will apply CME bans and Cat's Active Threats to
protected rooms, as well as watch matrix.org's lists without applying them to
rooms (i.e. the bot will send messages when the list adds policies, but won't
take action based on those).

```json
{
	"lists": [
		{
			"auto_unban": true,
			"auto_suspend": true,
			"name": "CME bans",
			"room_id": "!fTjMjIzNKEsFlUIiru:neko.dev",
			"shortcode": "cme"
		},
		{
			"name": "Cat's Active Threats",
			"room_id": "!QJKZNWnsItkUuthamp:feline.support",
			"shortcode": "cat"
		},
		{
			"auto_unban": true,
			"dont_apply": true,
			"name": "matrix.org coc",
			"room_id": "!WuBtumawCeOGEieRrp:matrix.org",
			"shortcode": "morg-coc"
		},
		{
			"auto_unban": true,
			"dont_apply": true,
			"name": "matrix.org tos",
			"room_id": "!tUPwPPmVTaiKXMiijj:matrix.org",
			"shortcode": "morg-tos"
		}
	]
}
```

The aliases for the policy lists referenced above are:

* [#community-moderation-effort-bl:neko.dev](https://matrix.to/#/#community-moderation-effort-bl:neko.dev)
* [#huginn-muminn-active-threats:feline.support](https://matrix.to/#/#huginn-muminn-active-threats:feline.support)
* [#matrix-org-coc-bl:matrix.org](https://matrix.to/#/#matrix-org-coc-bl:matrix.org)
* [#matrix-org-hs-tos-bl:matrix.org](https://matrix.to/#/#matrix-org-hs-tos-bl:matrix.org)

When you send the event adding a new watched list, Meowlnir will confirm it was
successful by sending a message. If you added a list and no message was sent,
you probably did something wrong.

In addition to configuring watched lists, you'll need to tell the bot to join
the policy list rooms you want to watch. The `!join <room ID or alias>` command
can be used to tell the bot to join any room. The command on its own will not do
anything else than join the room.

Available extra flags:

* `dont_apply` - Watch the list (send notifications) without taking action based
  on the policies.
* `dont_apply_acl` - Watch the list and apply all other actions, except for
  updating `m.room.server_acl` events in protected rooms.
* `auto_unban` - Automatically unban users if the policy that triggered the ban
  is removed.
* `auto_suspend` - If a policy bans a local user, suspend them using the Synapse
  admin API automatically. The bot user must be marked as a server admin.
* `dont_notify_on_change` - Don't send management room notifications when
  policies are added, removed or modified. Useful if you have multiple
  management rooms and don't want to be spammed in all of them.

## Protecting rooms
Protected rooms are listed in the `fi.mau.meowlnir.protected_rooms` state event.
The state key must be empty and the event content is simply a `rooms` key which
is a list of room IDs.

You can also use the `!rooms protect <id or alias>` command instead of sending
the state event manually.

```json
{
	"rooms": [
		"!randomid:example.com",
		"!anotherrandomid:example.com"
	]
}
```

After adding rooms to this list, you can invite the bot to the room, or use the
`!join` command.
