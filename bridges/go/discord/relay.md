# Relaying with webhooks
_New in version 0.2.0_

The bridge supports using Discord's webhook feature to relay messages from
Matrix users who haven't logged into the bridge.

Webhook relays can be used regardless of how you logged into Discord, a bot is
not required. However, in the future the bridge may include additional relay
integration using a bot.

If you want to use the bridge for relaying only and don't want to log in with
your real Discord account, it is recommended to have a dedicated Matrix account
to log in as the bot user. If you log in on your main Matrix account, your
messages will be sent through the bot rather than through the webhook with
custom profiles.

## Setup
To enable relaying in a room, use `!discord set-relay`. The command requires a
parameter, which can either be `--create [name]` or `--url <url>`.

The room must be bridged before running `set-relay`. You can either have the
bridge create rooms by bridging the entire guild with the `guilds` command, or
you can bridge individual channels using the `bridge` command. See the [bridging
rooms](./bridging-rooms.md) page for more info.

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

To get avatars to show up, you must set the `public_address` field in the
`bridge` section to a public https address that Discord can use to reach the
bridge (the same server as defined in the `appservice` section). Discord will
use the `/mautrix-discord/avatar/{server}/{id}/{hash}` endpoint on the provided
address to download avatars.

## In-depth explanation of bridging modes
The bridge has two ways of bridging messages to Discord:

* Messages from users who have logged in (i.e. ran the `login` command
  successfully) will be bridged through the account they logged in with.
  It makes no difference whether the account is a bot or a real user.
  * Bots and users can't change their profile info per message on Discord.
    They always use the profile set for the bot or user.
* Messages from users who have not logged in will be bridged through the webhook
  set for the portal, if there is one. If not, those messages will not be
  bridged at all.
  * Webhooks can change their profile info per message on Discord, so the bridge
    will send the Matrix user's profile info for each message.

If you run `login bot <bot token>` using your main Matrix account, then your
messages will be bridged through the bot (with the bot's default name/avatar),
not through the webhook with a custom name/avatar. Therefore, if you want your
messages to be bridged through the webhook, don't run the command on your main
account. Instead, you should make a separate Matrix account just for logging
into the bridge as the Discord bot.

The bridge has no special features when logging in with a bot token. If one or
more users log in with their real Discord accounts, there is no benefit to
having a bot too. A webhook is sufficient for bridging messages from Matrix
users who haven't logged in.
