# Commands

### General
* `/help` - View command list.
* `/quit` - Close gomuks.
* `/clearcache` - Clear room state and close gomuks.
* `/logout` - Log out, clear caches and go back to the login view.
* `/fingerprint` - Shows the Device ID and fingerprint, allowing verification of
  the session.
* `/copy [register]` - Copy the selected message to the specified clipboard
  register (defaults to `clipboard`).
* `/toggle <thing>` - Toggle user preferences.
  * `rooms` - Room list sidebar.
  * `users` - User list sidebar.
  * `baremessages` - Bare message mode where the sender name is inline with the
    messages.
  * `images` - Text image rendering.
  * `typingnotif` - Outgoing typing notifications.
  * `emojis` - `:emoji:` conversion when sending messages.
  * `html` - HTML input.
  * `markdown` - Markdown input.
  * `downloads` - Automatic downloads (this will also prevent `images` from
    working).
  * `notifications` - Desktop notifications.
  * `unverified` - Sending (e2ee keys for) messages to unverified devices.
    You need to restart gomuks for this setting to take effect.
  * `inlineurls` - Inline URLs in text. May not be supported in all terminals.
    You need to restart gomuks for this setting to take effect.

### Media
Tab-completing file paths is supported in all these commands.

* `/download [path]` - Downloads file from selected message. If path is not
  specified, it defaults to `<download_dir>/<message.body>`. `download_dir`
  defaults to `$HOME/Downloads`.
* `/open [path]` - Download file from selected message and open it with
  `xdg-open`. If path is not specified, the file will be downloaded to the
  media cache.
* `/upload <path>` - Upload the file at the given path to the current room.
  Note that to include audio/video file metadata (dimensions and duration),
  you must have `ffprobe` installed.

### Sending special messages
* `/me <text>` - Send an emote.
* `/notice <text>` - Send a notice (generally used for bot messages).
* `/rainbow <text>` - Send rainbow text.
* `/rainbowme <text>` - Send rainbow text in an emote.
* `/rainbownotice <text>` - Send rainbow text in a `m.notice` message.
* `/reply [text]` - Reply to the selected message. If text is not specified,
  the next message will be used.
* `/react <reaction>` - React to the selected message.
* `/redact [reason]` - Redact (delete) the selected message.
* `/edit` - Edit the selected message.

### Encryption
These commands support tab-completing file paths and user/device IDs using the
displaynames of users/devices.

Accepting incoming interactive verification requests is not yet supported, only
outgoing requests via `/verify` work.

* `/fingerprint` - View the fingerprint of your device
  (for legacy/non-interactive verification).
* `/devices <user id>` - View the device list of a user.
* `/device <user id> <device id>` - Show info about a specific device.
* `/unverify <user id> <device id>` - Un-verify a device.
* `/blacklist <user id> <device id>` - Blacklist a device. Message keys are
  never sent to blacklisted devices.
* `/verify <user id> <device id> [fingerprint]` - Verify a device. If the
  fingerprint is not provided, interactive emoji verification will be started.
* `/export <path>` - Export all message decryption keys to the given path.
* `/export-room <path>` - Export message decryption keys for the current room
  to the given path.
* `/import <path>` - Import message decryption keys from the given path.
* `/cross-signing <subcommand> [...]` - Cross-signing commands. Somewhat experimental. (alias: `/cs`).
  * `status` - Check the status of your own cross-signing keys.
  * `generate [--force]` - Generate and upload new cross-signing keys.
     This will prompt you to enter your account password.
     If you already have existing keys, `--force` is required.
  * `self-sign` - Sign the current device with cached cross-signing keys.
    (or in other words, verify the current device).
  * `fetch [--save-to-disk]` - Fetch your cross-signing keys from SSSS and
    decrypt them. If `--save-to-disk` is specified, the keys are saved to disk.
  * `upload` - Upload your cross-signing keys to SSSS.
* `/ssss <subcommand> [...]` - Secure Secret Storage (and Sharing) commands. Very experimental.
  * `status [key ID]` - Check the status of your SSSS.
  * `generate [--set-default]` - Generate a SSSS key and optionally set it as the default.
  * `set-default <key ID>` - Set a SSSS key as the default.

### Rooms
#### Creating
* `/pm <user id> [...]` - Start a private chat with the given user(s).
* `/create [room name]` - Create a new room.
#### Joining
* `/join <room> [server]` - Join the room with the given room ID or alias,
  optionally through the given server.
* `/accept` (in a room you're invited to) - Accept the invite.
* `/reject` (in a room you're invited to) - Reject the invite.
#### Existing
* `/invite <user id>` - Invite the given user ID to the room.
* `/roomnick <name>` - Change your per-room displayname.
* `/tag <tag> <priority>` - Add the room to `<tag>`. `<tag>` should start with
  `u.` and `<priority>` should be a float between 0 and 1. Rooms are sorted in
  ascending priority order.
* `/untag <tag>` - Remove the room from `<tag>`.
* `/tags` - List the tags the room is in.
* `/powerlevel [thing] [level]` - View or change power levels in rooms.
#### Leaving
* `/leave` - Leave the current room.
* `/kick <user id> [reason]` - Kick a user.
* `/ban <user id> [reason]` - Ban a user.
* `/unban <user id>` - Unban a user.

#### Aliases
* `/alias add <localpart>` - Add `#<localpart>:your.server` as an address for
  the current room.
* `/alias remove <localpart>` - Remove `#<localpart>:your.server` (can be ran
  in any room).
* `/alias resolve <alias>` - Resolve `<alias>` or `#<alias>:your.server` and
  reply with the room ID.

### Raw events
* `/send <room id> <event type> <content>` - Send a custom event.
* `/setstate <room id> <event type> <state key/-> <content>` - Change room state.
* `/msend <event type> <content>` - Send a custom event to the current room.
* `/msetstate <event type> <state key/-> <content>` - Change room state in the
  current room.
* `/id` - Get the current room ID.

### Debugging
* `/hprof` - Create a heap profile and write it to `gomuks.heap.prof` in the
  current directory.
* `/cprof <seconds>` - Profile the CPU usage for the given number of seconds
  and write it to `gomuks.cpu.prof`.
* `/trace <seconds>` - Trace calls for the given number of seconds and write
  traces to `gomuks.trace`.
