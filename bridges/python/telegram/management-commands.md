# Management commands
These commands can be used to interact with the bridge and Telegram in ways not
supported by native Matrix actions.

Management commands only work if the bridge bot is in the room. This means that
private chat portals do not currently support management commands.

If the room you send the command to does not have users other than you and the
bridge bot, you do not have to prefix commands, i.e. you can literally write
`help` to get the help message. **If the room has more users, you must use the
command prefix (`!tg` by default). For example: `!tg help`.** The command prefix
is always allowed even if it's not required.

## Generic bridge commands
| Command     | Usage                                     |
|-------------|-------------------------------------------|
| **help**    | Show this help message.                   |
| **cancel**  | Cancel an ongoing action (such as login). |
| **version** | View the bridge name and version.         |

## Authentication
Commands to authenticate with Telegram.

| Command                       | Usage                                                                       |
|-------------------------------|-----------------------------------------------------------------------------|
| **login** \[_mxid_]           | Get instructions on how to log in. Admins can use the _mxid_ parameter to log in as another user. |
| **logout**                    | Log out from Telegram.                                                      |
| **login-matrix**              | Replace your Telegram account's Matrix ghost with your own Matrix account. |
| **ping-matrix**               | Pings the server with the stored matrix authentication.                     |
| **ping**                      | Check if you're logged into Telegram.                                       |
| **ping-bot**                  | Get info of the message relay Telegram bot.                                 |
| **username** <_new username_> | Change your Telegram username.                                              |
| **session** <`list`\|`terminate`> \[_hash_] | View or delete other Telegram sessions.                               |

## Creating portals
Commands to make connections to Telegram chats.

| Command                | Usage |
|------------------------|-------|
| **bridge** \[_id_]     | Bridge the current Matrix room to the Telegram chat with the given ID. The ID must be the prefixed version that you get with the `/id` command of the Telegram-side bot. |
| **create** \[_type_]   | Create a Telegram chat of the given type for the current Matrix. _type_ is either `group`, `supergroup` or `channel`. Defaults to `group` |
| **pm** <_username_>    | Open a private chat with the given Telegram user. You can also use a phone number instead of username, but you must have the number in your Telegram contacts for that to work. |
| **join** <_link_>      | Join a chat with an invite link. _link_ is a complete t.me invite link, e.g. https://t.me/telegram |

## Portal management
Commands to manage the Telegram chats linked to portals. These can only be used in portal rooms and will directly affect the Telegram chat linked to the portal.

Most of these commands require some admin privileges in the Telegram chat: The bot will inform you if you do not have sufficient permissions.

| Command                        | Usage |
|--------------------------------|-------|
| **invite-link**                | Get a Telegram invite link to the current chat. |
| **upgrade**                    | Upgrade a normal Telegram group to a supergroup. |
| **group-name** <_name_\|`-`>   | Change the username of a supergroup/channel. To disable, use a dash (`-`) as the name. |
| **delete-portal**              | Remove all users from the current portal room and forget the portal. Only works for group chats; to delete a private chat portal, simply leave the room. |
| **unbridge**                   | Remove ghosts from the current portal room and forget the portal. |

### Portal configuration
Some bridge settings can be set on a per-portal basis. The `!tg config` command is used for that.

| Command                   | Usage                           |
|---------------------------|---------------------------------|
| **help**                  | View this help text.            |
| **view**                  | View the current config data.   |
| **defaults**              | View the default config values. |
| **set** <_key_> <_value_> | Set a config value.             |
| **unset** <_key_>         | Remove a config value.          |
| **add** <_key_> <_value_> | Add a value to an array.        |
| **del** <_key_> <_value_> | Remove a value from an array.   |

## Miscellaneous things
| Command                                | Usage                                                             |
|----------------------------------------|-------------------------------------------------------------------|
| **search** \[_-r\|--remote_] <_query_> | Search your contacts or the Telegram servers for users.           |
| **sync** \[`chats`\|`contacts`\|`me`]  | Synchronize your chat portals, contacts and/or own info.          |
| **sync-state**                         | Fetch Matrix room state to ensure the bridge has up-to-date info. |
| **id**                                 | Get the ID of the Telegram chat where this room is bridged.       |
| **play** <_play ID_>                   | Play a Telegram game.                                             |
| **caption** <_caption_>                | Set a caption for the next image or file you send.                |

## Administration
Bridge admin commands that do advanced things.

| Command                                           | Usage                                                   |
|---------------------------------------------------|---------------------------------------------------------|
| **filter-mode** <`whitelist`\|`blacklist`>        | Change whether the bridge will allow or disallow bridging rooms by default. |
| **filter** <`whitelist`\|`blacklist`> <_chat ID_> | Allow or disallow bridging a specific chat.             |
| **clean-rooms**                                   | Clean up unused portal/management rooms.                |
| **set-pl** <_level_> \[_mxid_]                    | Set a temporary power level without affecting Telegram. |
| **clear-db-cache** <`portal`\|`puppet`\|`user`>   | Clear internal database caches                          |
| **reload-user** \[_mxid_]                         | Reload and reconnect a user                             |

<!-- † Not yet in a release -->
