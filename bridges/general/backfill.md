# Backfilling messages
Most bridges here support fetching old messages and backfilling them into the
Matrix room. However, the level of support and config options vary a lot
between bridges.

In general, backfill happens automatically, and the recommended way to do
backfilling is to configure the bridge the way you want before starting to use
it. Some bridges also have a `backfill` command, but automatic backfill is
better due to the Matrix limitations mentioned in the section below.

## How backfilling works
Bridges can set the timestamp of each message they send, which is the basic
principle behind backfilling. This mechanism is called [timestamp massaging].

Matrix doesn't give bridges any way to actually insert messages into the room
history, which means backfilled messages always appear at the "end" of the
room, even if their timestamps say they're older. In other words, historical
message backfill only works in new empty rooms, because backfilling older
messages would cause them to be in the wrong order. Messages that were missed
while the bridge was offline can also be backfilled in existing rooms, but that
behavior usually doesn't need configuring, so most of this page talks
specifically about backfilling historical messages.

[MSC2716] used to be a method for inserting messages into room history, but the
original goal of migrating Gitter history to Matrix ended up being done without
actual backfill just using timestamp massaging, so the Element/Synapse
developers working on MSC2716 decided to abandon it. Beeper (who develops these
bridges) also doesn't use Synapse for bridged rooms, which means there's nobody
left to work on MSC2716. Support for MSC2716 has been removed from Synapse and
the bridges. Some bridges may still have config options mentioning MSC2716, but
those will be replaced with Beeper-specific options in the future.

A future spec proposal may enable true backfilling again, but currently it
seems unlikely that anyone would want to spend time to figure out the
federation-related issues that MSC2716 encountered, as well as making the API
easy to use for bridges.

[timestamp massaging]: https://spec.matrix.org/v1.8/application-service-api/#timestamp-massaging
[MSC2716]: https://github.com/matrix-org/matrix-spec-proposals/pull/2716

## Quirks of backfill in different bridges

### WhatsApp
WhatsApp primarily uses "history sync" blobs, which the phone automatically
sends to linked devices soon after successfully linking. If backfill is
enabled, the bridge will temporarily save those messages to the database, and
delete them once it has either backfilled the chat or found that the room
already has messages and backfill isn't possible anymore. There's no way to
re-request the initial history sync blobs, so if backfill is disabled or
something goes wrong, the only way to retry is to log out and back in.

If `max_initial_conversations` is set to zero or higher, messages in chats
without portal rooms will be stored in the bridge database until the room is
created for some other reason (like a new incoming message), at which point
backfill will happen and the messages will be deleted. The field defaults to
`-1` (= create all chats), which means messages won't be stored for long with
the default configuration.

The amount of history sent by the phone depends on what the linked device
requests: web clients request 3 months, while desktop clients request 1 year.
The amount requested by the bridge can be configured using the
`request_full_sync` and `full_sync_config` config options. Note that the full
sync fields do not affect how much is actually backfilled: if you want more
messages, you must also change the `message_count` option.

More recently, WhatsApp has also added on-demand history syncs, but those are
not yet implemented in the bridge. On-demand history sync wouldn't be
particularly useful in most cases, as messages can't be inserted into the
history anyway. It would primarily be useful if something goes wrong in the
initial backfill, or when receiving a message in a very old chat that wasn't
included in the initial history sync blob.

### Signal
Native Signal clients don't support any sort of history transfer (yes, the UX
of their official desktop app is horrible). Eventually, the bridge may add an
option to import backup files from Signal Android, but that is not supported
yet.

### Slack
The Slack bridge does not support traditional backfill currently, it only
supports the Beeper flavor of MSC2716.
