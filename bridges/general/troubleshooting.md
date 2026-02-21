# Troubleshooting & FAQ
Debugging setup issues should be done in the Matrix rooms for the bridges
(linked in the READMEs), rather than in GitHub issues. Additionally, this
page will collect some of the most common issues.

## Why is the bridge bot not accepting invites? (or not receiving messages from Matrix)
If the bridge starts up successfully, but inviting the bot doesn't work and the
logs don't show any errors, it usually means the homeserver isn't sending
events to the appservice.

In the case of mautrix-imessage, there's no need to invite the bot for setup,
so this issue manifests as outgoing messages not working.

There are a few potential reasons this can happen:

* There was a misconfiguration in the appservice address/hostname/port config
  or the homeserver can't reach the appservice for some other reason. The
  homeserver logs should contain errors in this case (grep for `transactions` in
  Synapse's `homeserver.log`).
  * Note that grepping for `transactions` will show some data even when it's
    working correctly. If it shows nothing at all, something is broken.
  * Also note that `transaction` is not the same as `transactions`. If you don't
    include the `s` at the end, you'll get tons of unrelated logs.
  * For mautrix-imessage, you should also check the wsproxy logs.
  * As of Synapse v1.84 and bridges released after May 2023, the bridges will
    automatically use the appservice ping mechanism to detect configuration
    issues and report them in bridge logs.
* The bridge was down for longer than a few minutes and the homeserver backed
  off. The homeserver should retry after some time. If it still doesn't work
  after an hour or so (exact backoff depends on how long the bridge was down),
  check the homeserver logs.
  * Starting with Synapse 1.132, the ping mechanism should reset the backoff,
    so this problem should also go away.
* You started a chat with the wrong user ID. The user specified in `appservice`
  -> `bot` -> `username` is the only one that will accept invites.

## The bot accepted the invite, but I don't see any responses from the bridge bot in Matrix
Check the bridge logs to see if the bridge is receiving the messages and
whether it's responding to them or just not handling them at all.

If there's nothing in the logs, then the homeserver may have backed off on
sending transactions as per the above entry.

If there are incoming transactions in the bridge logs, but no response, it might
mean you sent an unprefixed command to a non-management room. If you started the
chat in a non-standard way instead of just creating a DM, the chat may not be
registered as your management room. In non-management rooms, commands have to be
prefixed by the command prefix defined in the config (e.g. `!wa login` instead
of `login`).

## I don't see any responses from the bridge bot in Matrix, but the responses are visible in the bridge logs
Make sure you didn't ignore the bot.

Settings -> Security & Privacy -> Advanced -> Ignored users on Element.

## Why are direct messages showing up under "Rooms" instead of "People"?
All chats in Matrix are actually rooms, and there's no good way for bridges to
declare that a room is a DM. Specifically, the DM status is stored in the
user's account data in the `m.direct` event, rather than in the room itself.
Since the flag isn't stored in the room, there's no way for the room creator
to force the room to be a DM.

The bridges include a hacky workaround, which uses [double puppeting] to update
the `m.direct` account data event directly. It can be turned on with the
`sync_direct_chat_list` config option. Alternatively, you can manually add
individual rooms using the `/converttodm` command in Element Web/Desktop.

Canonical DMs ([MSC2199]) should fix the issue permanently by actually storing
the DM status in the room itself, but so far it has not been implemented in any
clients or servers.

[double puppeting]: ./double-puppeting.md
[MSC2199]: https://github.com/matrix-org/matrix-spec-proposals/pull/2199

## Why is the bridge bot in direct chats?
The bridge bot is necessary when using end-to-bridge encryption, and to keep
things more consistent, it's included even in unencrypted rooms.

The bridge will send member hints to the room to tell clients to ignore the
bridge bot when calculating the room name. However, if you use a client that
doesn't support [MSC4171](https://github.com/matrix-org/matrix-spec-proposals/pull/4171),
you can enable `private_chat_portal_meta` in the bridge config to tell it to
explicitly set the room name and avatar.

## Why are messages showing up as "Encrypted by a deleted session"
Also:

* "Encrypted by a device not verified by its owner"
* "The sender of the event does not match the owner of the device that sent it"
* possibly other similar warnings

All messages sent by the bridge are encrypted using the bridge bot's session
even though they're sent with different accounts, which may confuse some clients.

As long as you've enabled the `self_sign` option under `encryption`, the bridge
bot should be verified, so it'll keep receiving messages even after clients stop
encrypting for unverified devices in April 2026.

The bridge could technically create a separate e2ee session for each ghost user
to avoid the warning, but that would be ridiculously inefficient, so it won't
happen. In the future, there will be a proper way to define that the ghost users
are delegating e2ee handling to the bridge bot, which will allow clients to
remove the warnings. See [MSC4350] for more info.

[MSC4350]: https://github.com/matrix-org/matrix-spec-proposals/pull/4350

## Can I verify the bridge e2ee session?
The bridge can verify itself if you enable the `self_sign` option in the config.
You should set it to ensure that the bridge keeps working after clients stop
encrypting messages for unverified devices in April 2026. However, setting it is
not expected to remove the warnings mentioned in the section above.

Interactive verification is not supported, so you can't verify the bot's
cross-signing keys from your own account, you can only have the bridge verify
itself.

## The bridge can't decrypt my messages!
It's unfortunately quite easy to misconfigure things in a way that prevents
the bridge from decrypting messages. Places to start troubleshooting:

* Make sure `appservice` is set to `false` in the encryption config
  unless you have configured the appropriate experimental features and
  registration flags (or are connecting to Beeper servers).
* When using next-gen auth/MAS, enabling `msc4190` in the bridge config is
  mandatory.
* Check the logs to ensure the bridge bot syncs are successful. It should log
  a sync request every 30 seconds on the debug level even if there's no
  activity, and the status code should always be `200`.
  * Synapse has some bugs where `/sync` starts throwing internal server errors
    after previously working fine. If that happens, the easiest workaround is
    to get the latest `since`/`next_batch` token (e.g. from your own client,
    they're global) and insert it into the `crypto_account` table in the bridge
    database.
  * When using appservice mode, there won't be any `/sync` requests. Instead
    you should see `Starting handling of transaction` logs with
    `unstable_to_device` or `device_changes` keys.
* Make sure you haven't enabled "Never send encrypted messages to unverified
  sessions" or similar options in your client. The options usually exist both
  in global settings and in room settings.
* Try `/discardsession` (available on Element Web at least) and see if there
  are any new kinds of errors in the bridge logs when you next send a message
  (the client will share a new megolm session, which should show up in the
  logs).

## How do I bridge typing notifications and read receipts?
The bridges use [MSC2409] to receive ephemeral events (EDUs) from the Matrix
homeserver and bridge them to the remote network. It is enabled by default in
new bridge instances, but old ones may need to update the bridge config and/or
registration file manually. Additionally, MSC2409 is currently only supported
in Synapse.

On the bridge side, the config field is `appservice` -> `ephemeral_events`.
The registration file given to the homeserver must also have the
`de.sorunome.msc2409.push_ephemeral` field set to true. For servers implementing the final spec, the registration file field will be called `receive_ephemeral` with no
prefix. If it's not set, you can either set it manually, or regenerate the
registration after setting `ephemeral_events` to true in the bridge config.
Remember to restart the homeserver after modifying the registration file.

Previously there was an option to use `/sync` with [double puppeting] to receive
ephemeral events without MSC2409 support. However, that option is being phased
out, so MSC2409 is the only option now.

[MSC2409]: https://github.com/matrix-org/matrix-spec-proposals/pull/2409

## Why are contact list names disabled by default?
Some bridges like WhatsApp and Signal have access to the contact list you've
uploaded to their servers. However, the bridges will not use those names by
default. The reason is that they cause problems if your bridge has multiple
Matrix users with the same people in their contact lists.

* Contact list names might be leaked to other Matrix users using the same bridge.
  * Per-room displaynames could somewhat mitigate this, but even that wouldn't
    work if you're in some bridged groups with the other Matrix users.
* Bridge ghosts might flip between names from different Matrix users' contact lists.

If the bridge only has one user, then contact list names should be safe to enable.

## mautrix-whatsapp: Messages in some groups are no longer bridged
...even though it worked before. The logs say
`M_EXCLUSIVE (HTTP 400): Invalid user localpart for this application service`

This happens to bridges that were set up before the v0.5.0 release due to
WhatsApp's migration away from phone numbers as the primary internal identifier.

Instead of `@whatsapp_<phonenumber>:example.com`, user IDs will take the form
`@whatsapp_lid-<randomnumber>:example.com`. However, prior to v0.5.0, the bridge
would generate registrations where the user ID regex was `@whatsapp_[0-9]+`,
which doesn't allow the new format. To make the bridge work in groups that
WhatsApp has migrated to LIDs, you must ensure that `registration.yaml` has
`.+` or `.*` in the regex, not `[0-9]+`.

When editing the registration file, make sure you edit the file that your
homeserver is reading, as you may have copied the file from the bridge's data
directory to the homeserver's. The bridge itself never reads the registration
file, so updating the wrong file will do nothing.

After updating the registration and restarting your homeserver, messages in
groups should start working immediately. You can also use the `!wa sync groups`
command to fix group member lists immediately.

## mautrix-gvoice: `unexpected status code 429 (electron status: unavailable)`
This error usually happens for non-workspace accounts when trying to send a
message. As mentioned in the setup instructions, mautrix-gvoice requires having
access to the `electron` binary, which is not available in Docker.

If the error says `electron status: ok` instead of `unavailable`, then there's
something else wrong.

## `pip` failed building wheel for python-olm

#### `fatal error: olm/olm.h: no such file or directory`
When building with end-to-bridge encryption, you must have a C compiler,
python3 dev headers and libolm3 with dev headers installed.

If you want to build without encryption:
* For Python bridges, don't install the `e2be`
  [optional dependency](../python/optional-dependencies.md).
* For Go bridges, either build with `-tags nocrypto` or disable cgo with the
  `CGO_ENABLED=0` env var.

#### `fatal error: olm/pk.h: no such file or directory`
libolm2 is too old, you need libolm3.

#### `fatal error: pyconfig.h: no such file or directory`
python3-dev is required.

#### `error: command 'gcc' failed: No such file or directory`
build-essential is required.

## Configuration error: `<field>` not configured
You didn't change the value of `<field>` in the config, but that field must be
configured for the bridge to work (i.e. the default value will not work). Dots
in `<field>` mean nesting, e.g. `bridge.permissions` means the `permissions`
field inside the `bridge` object.

## ForeignTablesFound: The database contains foreign tables
As mentioned in the setup page, you should not share a single Postgres database
between unrelated programs.

You can create a separate database either using the `createdb` shell command
that is usually included with Postgres, or the `CREATE DATABASE` SQL statement.
After creating a separate database, adjust the database URI in the bridge config.

For existing installations, you can use the CLI flag to ignore the error (see
`--help`) and hope that there are no table name conflicts in the future. To use
the flag in Docker, you'll have to override the startup command, either with a
copy of the `docker-run.sh` script (which can be found in the bridge repo), or
just the startup command (`python3 -m mautrix_$bridge -c /data/config.yaml --flags`).

## The `as_token` was not accepted
The error means the bridge was able to connect to the configured homeserver, but
the homeserver rejected the bridge's token. A few different ways the tokens
might be wrong:

* The registration file wasn't added to the homeserver config.
* The homeserver wasn't restarted after adding the registration file.
* The tokens were modified (in either of the files) and weren't copied to the
  other file, or either side wasn't restarted after modification.
  * Generating a new registration file always modifies the tokens.
  * When using Docker, the container will generate a new registration on startup
    if the file doesn't already exist (the container won't check the file
    contents, just the existence).
* The homeserver URL is wrong and the bridge is connecting to an entirely
  different server than where the registration is.
* You're looking at the wrong files and didn't actually make changes to the
  correct ones.

## The `as_token` was accepted, but the `/register` request was not
This error can happen through a few different misconfigurations.
Unfortunately the homeserver doesn't tell more specifically.
The possible misconfigurations are:

* having the incorrect value in `homeserver` -> `domain`
  * This is the most common issue. The domain must match the `server_name`
    in your homeserver's config. If it doesn't, fix it, regenerate the
    registration file and restart everything.
* changing the bot username without regenerating the registration
* having another appservice registration exclusively claiming the same
  namespace.

## Homeserver -> bridge connection is not working
At startup, the bridge will ask the homeserver to check that it can reach the
bridge. If the homeserver reports an error, the bridge will log the error and
exit. This ensures that it's actually working if the bridge runs successfully,
rather than being silently broken by not receiving messages. This mechanism is
called "appservice ping".

The error message associated with this log is the error that the homeserver
(e.g. Synapse) encountered while connecting to the bridge. **It is not an
error from the bridge itself.**

To fix the error, ensure that your homeserver can reach the bridge at the
configured address. The address is configured in the `appservice` -> `address`
field in the bridge config, although in reality the homeserver reads it from
the `url` field in the registration file that you gave to the homeserver. The
bridge config field is just copied to the registration when the registration
is generated. If you change the value, you can either manually update the
registration, or regenerate it completely.

## Why is the latest release old?
When bridges are being actively developed, releases are effectively always
outdated. The main branch is generally stable and safe to use in production,
although automatic unattended upgrades are not recommended. Bugs should only be
reported on the main branch.

New releases for Go bridges happen on the 16th of each month. Sometimes
releases may be skipped if there's something blocking the release or if nothing
relevant has changed since the last one. Releases outside of the standard cycle
only happen if there are severe security issues that must be fixed immediately.

Anything older than the latest release is completely unsupported and there
won't be any patches even for security issues.

Python bridges do not have a release cycle, releases will happen randomly.

## the supplied account key is invalid
This error means that the `pickle_key` specified in the config is incorrect.
Old versions of bridges used to have a hardcoded key, but new versions generate
a random one and save it in the config.

If you're upgrading from an old version, the legacy migration should
automatically copy the old hardcoded key into the config file. However, if you
prevented the migration from writing the config, you may need to manually set
it. You can find the correct old key in the `legacymigrate.go` file under the
`cmd` directory in each bridge. Newer releases of some bridges have already
removed the legacy migration support, so you may need to check older releases
for it.

If you get the error even though you set up the bridge recently and didn't
migrate from an old pre-megabridge version, it's likely you prevented the bridge
from writing to the config and didn't set a random key yourself. If the pickle
key is lost, the database will have to be reset.
