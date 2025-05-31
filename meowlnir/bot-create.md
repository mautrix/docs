### Creating bots
You may have noticed that the config file doesn't have anything about the bot
username or management rooms. This is because the bots and management rooms can
be created dynamically at runtime and are saved in the database. The management
secret specified in the config is used to authenticate with the API that can
create bots.

Currently existing endpoints:

* `GET /_meowlnir/v1/bots` - List all bots
* `PUT /_meowlnir/v1/bot/{localpart}` - Create a bot
* `POST /_meowlnir/v1/bot/{localpart}/verify` - Cross-sign a bot's device
* `PUT /_meowlnir/v1/management_room/{roomID}` - Define a room as a management room

There will be a CLI and/or web UI later, but for now, you can use curl:

```shell
export AUTH="Authorization: Bearer $MANAGEMENT_SECRET"
```

First, create a bot. This example copies matrix.org's admin bot (`abuse` as the
username, `Administrator` as the displayname, and the same avatar):

```shell
curl -H "$AUTH" https://meowlnir.example.com/_meowlnir/v1/bot/abuse -XPUT -d '{"displayname": "Administrator", "avatar_url": "mxc://matrix.org/NZGChxcCXbBvgkCNZTLXlpux"}'
```

Assuming you didn't have an @abuse user before or if it didn't have encryption,
you can have Meowlnir generate cross-signing keys to verify itself. This
command will return the recovery key. Make sure to save it!

If you don't have encryption enabled, you can skip this step and jump straight
to defining a management room.

```shell
curl -H "$AUTH" https://meowlnir.example.com/_meowlnir/v1/bot/abuse/verify -d '{"generate": true}'
```

Alternatively, if the user already has cross-signing set up, you can provide
the recovery key for verification:

```shell
curl -H "$AUTH" https://meowlnir.example.com/_meowlnir/v1/bot/abuse/verify -d '{"recovery_key": "EsT* ****..."}'
```

Finally, you need to define a management room. Create the room normally, get
the room ID and run:

```shell
curl -H "$AUTH" -X PUT 'https://meowlnir.example.com/_meowlnir/v1/management_room/!randomroomid:example.com' -d '{"bot_username": "abuse"}'
```

After defining the room, you can invite the bot, and it should accept the invite
(you can also invite the bot beforehand if you prefer).

You can define multiple management rooms for the same bot if you want different
configurations for different protected rooms. You can also create multiple bots
as long as the appservice registration allows it via namespaces.
