# Bridging rooms
By default, the bridge will create portals for a few recent direct messages
after logging in. The `startup_private_channel_create_limit` option in the
config defines the number of chats.

Entire guilds can be bridged using the `guilds` command. Use `guilds status` to
view the list of guilds and get their IDs, then use `guilds bridge <id>` to
bridge a guild. After bridging, spaces will be created automatically, and rooms
will be created as necessary when messages come in. You can also pass `--entire`
to the bridge command to immediately create all rooms.

If you want to manually bridge channels, invite the bot to the room you want to
bridge and run `!discord bridge <channel ID>` to bridge the room. After that,
you can also use `!discord set-relay` to set up [relaying with webhooks](./relay.md).
