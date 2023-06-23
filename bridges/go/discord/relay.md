# Relaying with webhooks
_New in version 0.2.0_

The bridge supports using Discord's webhook feature to relay messages from
Matrix users who haven't logged into the bridge.

Webhook relays can be used regardless of how you logged into Discord, a bot is
not required. However, in the future the bridge may include additional relay
integration using a bot.

If you want to use the bridge for relaying only, it is recommended to have a
dedicated Matrix account to log in as the bot user. If you log in on your main
Matrix account, your messages will be sent through the bot rather than through
the webhook with custom profiles.

## Setup
To enable relaying in a room, use `!discord set-relay`. The command requires a
parameter, which can either be `--create [name]` or `--url <url>`.

The room must be bridged before running `set-relay`. You can either have the
bridge create rooms by bridging the entire guild with the `guilds` command, or
you can bridge individual channels using the `bridge` command.

* `!discord set-relay --create` will create a new webhook. You must be logged
  into the bridge as a user or bot that has privileges to create webhooks in
  on the Discord side.
  * You can optionally pass a name for the webhook after the command,
    e.g. `!discord set-relay --create matrix bridge`.
    The default name is "mautrix". Note that the name may not contain "discord".
* `!discord set-relay --url https://discord.com/api/webhooks/...` will use the
  given webhook URL for relaying.
  * You can optionally specify a room ID before `--url` to run the command in
    a private room (and avoid leaking the webhook secret to everyone else in
    the room being bridged), e.g.
    `!discord set-relay !26DmcJd3cQ...:example.com --url https://discord.com/...`
