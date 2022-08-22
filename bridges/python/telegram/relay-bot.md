# Relay bot
_New in version 0.2.0_

The bridge supports using a Telegram bot to relay messages for unauthenticated
users, allowing Matrix users who are not logged into their Telegram account to
chat with Telegram users.

## Setup
0. If you haven't yet, [create a new bot on Telegram] by chatting with
   [@BotFather].
   * Make sure you disable [privacy mode] using BotFather's `/setprivacy`
     command in order to allow the bot to read messages in groups.
   * If you added the bot to a group before disabling privacy mode, you'll have
     to remove the bot and re-add it to apply the change.
1. Configure the bridge to use the bot you created by setting the token you got
   from BotFather in the `telegram` → `bot_token` field in the bridge's config.
2. Restart the bridge and check status with the `!tg ping-bot` command on Matrix.
3. Invite the relaybot to groups where you want it to bridge messages from
   unauthenticated Matrix users. If you're logged in to the bridge, you can use
   `!tg ping-bot`, click the user pill and click invite directly. If not, you
   can add the bot on the Telegram side.

If the room was created by the bridge and you don't have invite permissions,
you can either use `!tg set-pl` to give yourself permissions, or
`/invite <mxid>` (on Telegram) to invite users through the bridge bot.

[create a new bot on Telegram]: https://core.telegram.org/bots
[@BotFather]: https://t.me/BotFather
[privacy mode]: https://core.telegram.org/bots#privacy-mode

## Creating relaybot portals from Telegram
You can also create portals from Telegram if you have the relay bot set up and
have allowed creating portals from telegram in the config (`bridge` → `relaybot`
→ `authless_portals`). Simply invite the relay bot to your Telegram chat and use
the `/portal` command. If the chat is public, the bot should create the portal
and reply with a room alias. If the chat is private, you'll need to invite
Matrix users manually with `/invite <mxid>`.

## Message format configuration
The format of messages and membership events that the bot sends to Telegram can
be configured both [bridge-wide](https://github.com/mautrix/telegram/blob/v0.7.0/example-config.yaml#L221-L255)
and per-room. Per-room configs can be managed using the `!tg config` command.

For example, to disable bridging of membership events in a room, you can run

```
!tg config set state_event_formats join: ''
leave: ''
name_change: ''
```

which sets the `state_event_formats` config option to an object containing the
empty strings `join`, `leave` and `name_change`.


## Commands
| Command               | Usage                                                         |
|-----------------------|---------------------------------------------------------------|
| **/invite** \[_mxid_] | Invite a Matrix user to the portal room.                      |
| **/portal**           | Create the portal if it does not exist and get the join info. |
| **/id**               | Get the prefixed ID of the chat that can be used with `!tg bridge` and `!tg filter` in Matrix |

If you have your own Telegram bot for the bridge, you can copy this to the
`/setcommands` BotFather command:

```
invite - Invite a Matrix user to the portal room.
portal - Create the portal if it does not exist and get the join info.
id - Get the prefixed ID of the chat that can be used with `!tg bridge` and `!tg filter` in Matrix
```
