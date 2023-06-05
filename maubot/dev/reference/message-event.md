# MessageEvent reference

These methods are available in maubot's `MessageEvent` class.

* `async react(key: str) -> EventID` - React to the command with the given key.
  The key can be arbitrary unicode text, but usually reactions are emojis.
* `async mark_read()` - Send a read receipt for the command event.
* `async respond(content) -> EventID` - Respond to a message without replying.
  Optional parameters:
  * `event_type` (defaults to `EventType.ROOM_MESSAGE`) - The event type to send
    the response as.
  * `markdown` (defaults to `True`) - Whether the `content` should be parsed as
    markdown. Only applies if the content parameter is a string.
  * `allow_html` (defaults to `True`) - Whether the `content` should allow HTML
    tags. Only applies if the content parameter is a string.
  * `edits` (optional, event ID or `MessageEvent`, defaults to `None`) - The
    event that the response event should edit.
  * `in_thread` (optional) - Whether the response should be in a thread with
    the command. By default (`None`), the response is in a thread if the
    command is in a thread. If `False`, the response will never be in a thread.
    If `True`, the response will always be in a thread (creating a thread with
    the command as the root if necessary).
* `async reply(content) -> EventID` - Reply to a message. Same parameters as
  `respond()`, except no `edits` option.
* `async edit(content) -> EventID` - Edit the event. Same parameters
  as `reply()`. Note that while this won't throw an error for editing non-own
  messages, most clients won't render such edits.
* `content` - Some useful methods are also inside the content property:
  * `relates_to` - A property containing the event's `m.relates_to` data wrapped
    in a `RelatesTo` object.
  * `get_reply_to() -> EventID` - Get the event ID the command is replying to.
  * `get_edit() -> EventID` - Get the event ID the command is editing.

## Event fields

These are the fields in the `MessageEvent` type (and also all other room events)
. They're a part of the Matrix spec, but maubot parses them into convenient
objects.

* `room_id` - The ID of the room where the event was sent.
* `event_id` - The ID of the event.
* `sender` - The ID of the user who sent the event.
* `timestamp` - The Unix timestamp of the event with millisecond precision (this
  is called `origin_server_ts` in the protocol).
* `type` - The event type as an `EventType` enum instance.
* `content` - The content of the event. This is parsed into specific classes
  depending on the event type and `msgtype`. If the type isn't recognized, this
  will be parsed into an `Obj`, which is just a dict that allows accessing
  fields with the dot notation.
* `unsigned` - Additional information that's not signed in the federation
  protocol. Usually set by the local homeserver.
  * `transaction_id` - If the message was sent by the current user, the
    transaction ID that was used to send the event.

### `m.room.message` content

These are the fields in the `MessageEventContent` type. As with event fields,
they're a part of the Matrix spec.

* `body` - The plaintext body.
* `msgtype` - The message type as a `MessageType` enum instance.

For `m.text`, `m.notice` and `m.emote` (`TextMessageEventContent`):

* `format` - The format for `formatted_body` as a `Format` enum instance.
* `formatted_body` - The formatted body (usually HTML).

For `m.image`, `m.video`, `m.audio` and `m.file` (`MediaMessageEventContent`):

* `url` - The `mxc://` URL to the file (if unencrypted).
* `file` - The URL and encryption keys for the file (if encrypted).
  * TODO: add methods to conveniently decrypt data using the `EncryptedFile`
    object.
* `info` - Additional info about the file. Everything here is optional and set
  by the sender's client (i.e. not trustworthy).
  * `mimetype` - The mime type of the file.
  * `size` - The size of the file in bytes.
  * TODO: document msgtype-specific info fields.

For `m.location` (`LocationMessageEventContent`):

* `geo_uri` - The coordinates the event is referring to as
  a `geo:<latitude>,<longitude>` URI.
* `info` - Optional info containing a thumbnail (same as image thumbnails).
