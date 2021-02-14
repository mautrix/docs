# Relaybot
## Configuration
1. Create a new room for relaybot management and get its internal ID
   (Room settings → Advanced → Internal room ID in Element Web).
2. Enable the relaybot and set the management room ID in [the relaybot config].
3. Optionally, add your Matrix account to the [`invites` list in the config]
   to get invited to the automatically created portal rooms for the relaybot.
4. Make sure the users you want to let into rooms have at least the `relaybot`
   permission in [the permissions section].
5. You may also want to set [`allow_user_invite`] to `true` so that you can
   invite more users to portals created by the bridge. The option is not applied
   retroactively, but you can use `!wa set-pl` to make yourself admin in
   existing rooms.
6. Restart the bridge and invite the bridge bot to the management room you
   created.

[the relaybot config]: https://github.com/tulir/mautrix-whatsapp/blob/v0.1.4/example-config.yaml#L221-L227
[`invites` list in the config]: https://github.com/tulir/mautrix-whatsapp/blob/v0.1.4/example-config.yaml#L228-L229
[the permissions section]: https://github.com/tulir/mautrix-whatsapp/blob/v0.1.4/example-config.yaml#L207-L219
[`allow_user_invite`]: https://github.com/tulir/mautrix-whatsapp/blob/v0.1.4/example-config.yaml#L175-L177

## Logging in
Note that only one user can be logged in with one WhatsApp account at a time,
i.e. you can't use the same account for yourself and the relaybot. If you're
currently logged in normally, use `!wa logout` in your normal (not relaybot)
management room before logging in with the relaybot.

1. Commands in the relaybot management room will always affect the relaybot
   instead of your own account, so simply use the normal `!wa login` command to
   make the relaybot log into WhatsApp.
2. Like with normal login, the relaybot will sync all WhatsApp chats. For newly
   created portals, everyone in the `invites` list (mentioned earlier) will be
   invited.

You can either invite more Matrix users to the automatically created portals or
see below for instructions on bridging existing Matrix rooms.

## Creating a new WhatsApp group for an existing Matrix room
There are currently a few bugs that affect this:
* You can only invite the bridge bot to an empty room
  ([#208](https://github.com/tulir/mautrix-whatsapp/issues/208)).
* ~~You can only create groups in encrypted rooms due to a bug in the bridge
  ([#209](https://github.com/tulir/mautrix-whatsapp/issues/209)).~~

1. Invite the bridge bot to the Matrix room.
2. Invite the ghosts of any WhatsApp users you want in the group right away.
3. Make sure the room has a name.
4. Run `!wa create` (or `!wa relaybot create` to create it through the relaybot)

## Bridging an existing Matrix room to an existing WhatsApp group
Bridging to existing groups is not currently implemented. However, you can
fairly easily modify the database to point the bridge at a different room.

TODO: the bridge bot probably needs inviting at some point

1. Find the JID of the WhatsApp group you want to bridge using
   `!wa relaybot list groups` (or just `!wa list groups` in the relaybot
   management room). If you can not find it just search for it in the database
   (e.g. `sqlite3 /matrix/mautrix-whatsapp/data/mautrix-whatsapp.db` then
   ` SELECT * FROM portal WHERE name='WhatsApp_Group_Name';` the first column
   is the jid).
2. Find the internal ID of the target matrix room (Room settings → Advanced →
   Internal room ID in Element Web) for example
   `!bJUfgWQZfgLWtXQqHzZxp:example.com`
3. Stop the bridge. (make sure it is actually stopped, possible commands for
   this using Docker or Ansible: `docker ps -a` or with
   `systemctl status matrix-mautrix-whatsapp.service`, possible commands to stop
   `docker stop containerID`, `systemctl stop matrix-mautrix-whatsapp.service`)
4. Run `UPDATE portal SET mxid='<target room id>' WHERE jid='groupid@g.us';` in
   the database. (Possible command to enter the db
   `sqlite3 /matrix/mautrix-whatsapp/data/mautrix-whatsapp.db`)
5. Start the bridge. The bridge should automatically sync the group members from
   WhatsApp and messages should be bridged in both directions. If not, add the
   WhatsApp bridge bot to the room. (`@whatsappbot:example.com`)
