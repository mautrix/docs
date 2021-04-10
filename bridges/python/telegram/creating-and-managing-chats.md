# Creating and managing chats
## Group chats and channels
### New Matrix rooms for existing Telegram chats
New portal rooms for existing Telegram chats should be created when:
1. The bridge is (re)started
2. The user logs in to Telegram
3. A message or an invite is received in the Telegram chat

If a portal room is somehow broken, you can tell the bridge to forget it using
the command `delete-portal`. The portal room will be recreated when one of the
conditions above is fulfilled. Note that automatic portal creation at
startup/login is only for group chats. Private chat portals are only created
when you receive a message or start a chat.

### New Telegram chats for existing Matrix rooms
You can use the `create` command to create a new Telegram chat for an existing
Matrix room.

~~Before running the command, make sure you have invited your appservice bot to
the room, given the bot PL 100 and removed PL 100 from everyone else.~~
As of 0.2.0, the bridge will function even without power levels.

### Existing Telegram chats to existing Matrix rooms
_New in version 0.2.0_

Get the ID of the Telegram chat with the `/id` command of the relay bot. If you
don't have/want a relay bot, figure out another way to get the telegram chat ID,
and make sure it's prefixed (`-100` for channels and `-` for chats). Then, run
`bridge <chat ID>` in the room you want to bridge. Again, make sure that the
appservice bot is in the room and the power levels are correct like in the
previous section.

### Matrix ⟷ Telegram mappings
Most Matrix actions are mapped to their Telegram counterparts. Joining, leaving,
inviting and kicking are mapped as-is.

Basic power level bridging is implemented. However, there may be some issues
that require restarting the bridge to properly sync the power levels. Also, the
power level requirements are currently hardcoded as follows:

* **Normal groups**
  * PL 0 = normal user
  * PL 50 = admin
  * PL 95 = creator
* **Supergroups and channels**
  * PL 0 = normal user
  * PL 50 = moderator (i.e. admin who can't add other admins)
  * PL 75 = admin
  * PL 95 = creator

## Private messages
### Creating portals
There are three ways to create private chat portals:
1. Create a room and invite the Matrix puppet of the Telegram user. The puppet
   should join and send confirmation of the portal creation.
2. Use the `pm` command.
3. Send or receive a message on another Telegram client.

### Matrix ⟷ Telegram mappings
Most non-messaging Matrix actions are ignored in private chat portals. However,
Leaving the portal will cause the portal room to be cleaned up and forgotten.

## Bot commands
Initiating chats with bots is no different from initiating chats with real
Telegram users.

_New in version 0.2.0:_ The bridge will translate Matrix->Telegram bot commands
at the start of the message from `!command` to `/command`.

Please note that when messaging a bot for the first time, it may expect you to
run `/start` first. The bridge does not do this automatically.
