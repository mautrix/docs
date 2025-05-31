# Configuring bots
After you've created a bot and assigned at least one management room, you'll
need to configure the bot in the management room to tell it which rooms to
protect and which policy lists to watch. All such configuration is stored in
room state events, which is what allows you to have different sets of configs by
having multiple management rooms.

In the future, there will be commands for managing all the state events, but for
now you need to send some of them manually (e.g. via `/devtools` in Element Web).

## Subscribing to policy lists
The `fi.mau.meowlnir.watched_lists` state event is used to subscribe to policy
lists. The state key must be empty and the content must have a `lists` key,
which is a list of objects. Each object must contain `room_id`, `shortcode` and
`name`, and may specify certain extra flags (documented below).

For example, the event below will apply CME bans and Cat's Active Threats to
protected rooms, as well as watch matrix.org's lists without applying them to
rooms (i.e. the bot will send messages when the list adds policies, but won't
take action based on those).

```json
{
	"lists": [
		{
			"auto_unban": true,
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

When you send the event adding a new watched list, Meowlnir will confirm it was
successful by sending a message. If you added a list and no message was sent,
you probably did something wrong.

To make the bot join a policy list, use the `!join <room ID or alias>` command.

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
