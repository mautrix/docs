# RPC API

## Envelope

All RPC messages (requests, responses and events) use the same envelope format:

* `command` (string): the command/event name.
* `request_id` (integer): incrementing (or decrementing) message ID. Responses
  will always contain the same ID. Requests without an ID will never be replied
  to. For events, the backend will start at -1 and go backwards.
* `data` (any): payload for the command/event, type depends on the command.

### Responses

For every request with `request_id` set, the backend replies exactly once with
the same `request_id` and one of:

* `command: "response"` with `data` containing the command-specific return value.
* `command: "error"` with `data` being the error message string.

### Cancellation

Requests can be canceled by sending a `cancel` request with the target
`request_id` inside `data`, plus an optional `reason` string. Cancellation is
best-effort: some operations may not stop immediately and there is no guarantee
of rollbacks.

## Websocket

The main method of connecting is using the websocket. The websocket is at
`_gomuks/websocket` and requires standard cookie authentication.

However, the RPC API is intentionally just JSON, so it can be sent over other
transports as well. In particular, when bundling the backend with the frontend,
it is recommended to use a direct in-process channel rather than the websocket.

### Compression

If the `compress` query param is set to `1`, the websocket will use a
connection-wide deflate compression similar to how Discord's gateway works.
Only messages sent by the backend are compressed; client messages are not.

Enabling compression will also enable batched messages in a single frame, i.e.
multiple JSON objects may be concatenated together using a newline (`\n`) as the
separator if the backend detects that the connection isn't keeping up. There is
currently no option to turn off batching when compression is enabled.

Compression is recommended for lower bandwidth networks like mobile data.
It can save up to 70% of bandwidth. The primary downside is that standard
developer tools will no longer understand the websocket messages.

### Event buffering

The backend will buffer events that the client hasn't acknowledged yet to allow
faster resuming in case the websocket is interrupted. To use session resumption,
the client has to handle the `run_id` command and store the `run_id` field
inside the data. When reconnecting, the client should include the run ID as well
as the most recent negative request ID it received in the `run_id` and
`last_received_event` query params respectively.

The event buffer is entirely in-memory, which means resumption will fail if the
backend has been restarted. For non-resumed inits, the first `sync_complete`
event will have the `clear_state` flag set to true. For successful resumes, the
client will only get missed events rather than the full initial sync.

The `init_complete` event is always sent once the client is caught up regardless
of whether the resume succeeded or not.

### Keepalive pings and event acknowledgement

Clients MUST send periodic pings to keep the connection alive. The backend will
kill connections that don't send any data for over 60 seconds. Clients SHOULD
implement similar timeouts and reconnect if they don't receive any data from the
backend. The recommended ping interval is 15 seconds.

Unlike normal requests, pings are exclusive to the websocket layer and will
result in `"command": "pong"` instead of `"command": "response"`.

In addition to keeping the connection open, pings are used to acknowledge
received events so that the backend can remove them from its in-memory cache.
Clients should include the most recent negative request ID they received in the
`last_received_id` field inside the `data` of the ping.

#### Example

Request:

```json
{
  "command": "ping",
  "request_id": 123,
  "data": {
    "last_received_id": -456
  }
}
```

Response:

```json
{
  "command": "pong",
  "request_id": 123
}
```

## Type notes

- `room_id`, `event_id`, `user_id`, etc are Matrix IDs (strings) in JSON.
- Many responses reference gomuks DB types (e.g. `database.Event`). Treat them as JSON objects; structure is defined by gomuks’ API and may evolve.
- Some request fields are raw JSON blobs (e.g. `content`) that must match the Matrix spec for the given event type.

## Commands

### `get_state`

Get current client state (login/verification/session info). Note that state is
also emitted as `client_state` events, so you usually don't need to request it
manually.

- **Request data:** N/A
- **Response data:** `ClientState`
  - `is_initialized` (bool)
  - `is_logged_in` (bool)
  - `is_verified` (bool)
  - `user_id` (string, optional)
  - `device_id` (string, optional)
  - `homeserver_url` (string, optional)

### `cancel`

Cancel an in-flight request.

- **Request data:**
  - `request_id` (int, required): request ID to cancel.
  - `reason` (string): optional cancellation reason.
- **Response data:** `bool`
  - `true` if a request with that ID was found and cancellation was triggered.
  - `false` if no in-flight request with that ID exists.

### `send_message`

Send a Matrix message into a room. This is a higher-level helper around sending
`m.room.message` (and related) content. This will always perform an asynchronous
send, which means the returned event won't have an ID yet. Listen for the
`send_complete` event to get the final result.

- **Request data:**
  - `room_id` (string, required)
  - `base_content` (object): non-text `m.room.message` event content.
    Only standard fields in mautrix-go's [`MessageEventContent`](https://pkg.go.dev/maunium.net/go/mautrix/event#MessageEventContent)
    are allowed here. This should be used for things like media attachments,
    as well as MSC4332 bot commands.
  - `extra` (object): non-standard fields for content.
  - `text` (string): text to send. If set, this will be used to fill the message
    `body`, `formatted_body`, `format` and `msgtype` fields. Media captions
    should be put here even when using `base_content` for the rest of the media.
  - `relates_to` (object): Standard `m.relates_to` data.
  - `mentions` (object): Standard `m.mentions` data.
  - `url_previews` (array): Beeper link preview objects (MSC4095).
- **Response data:** [`database.Event`](https://pkg.go.dev/go.mau.fi/gomuks/pkg/hicli/database#Event)

### `send_event`

Send an arbitrary event into a room.

- **Request data:**
  - `room_id` (string, required)
  - `type` (string, required)
  - `content` (object, required)
  - `disable_encryption` (bool): if true, don’t encrypt the event even if the
    room is encrypted.
  - `synchronous` (bool): if true, perform sending synchronously
    (returned DB event will have the event ID set, unless the send fails).
- **Response data:** [`database.Event`](https://pkg.go.dev/go.mau.fi/gomuks/pkg/hicli/database#Event)

### `resend_event`

Retry sending a previously failed outgoing event.

- **Request data:**
  - `transaction_id` (string, required)
- **Response data:** [`database.Event`](https://pkg.go.dev/go.mau.fi/gomuks/pkg/hicli/database#Event)

### `report_event`

Report an event to the homeserver.

- **Request data:**
  - `room_id` (string, required)
  - `event_id` (string, required)
  - `reason` (string)
- **Response data:** N/A

### `redact_event`

Redact an event.

- **Request data:**
  - `room_id` (string, required)
  - `event_id` (string, required)
  - `reason` (string)
- **Response data:** [`mautrix.RespSendEvent`](https://pkg.go.dev/maunium.net/go/mautrix#RespSendEvent)

### `set_state`

Send a state event into a room.

- **Request data:**
  - `room_id` (string, required)
  - `type` (string, required)
  - `state_key` (string)
  - `content` (object, required)
  - `delay_ms` (int): optional unstable delayed-event send (milliseconds).
- **Response data:** `event_id` (string)

### `update_delayed_event`

Update or cancel an unstable delayed event (MSC4140/unstable delay API).

- **Request data:**
  - `delay_id` (string, required)
  - `action` (string, required)
- **Response data:** [`mautrix.RespUpdateDelayedEvent`](https://pkg.go.dev/maunium.net/go/mautrix#RespUpdateDelayedEvent)

### `set_membership`

Invite, kick, ban or unban a user.

- **Request data:**
  - `action` (string, required): one of `invite`, `kick`, `ban`, `unban`.
  - `room_id` (string, required)
  - `user_id` (string, required)
  - `reason` (string)
  - `msc4293_redact_events` (bool): if true, the ban event will set a flag to
    suggest that clients hide all the user's messages.
- **Response data:** empty object

### `set_account_data`

Set global or per-room account data.

- **Request data:**
  - `room_id` (string): omit to set global account data.
  - `type` (string, required)
  - `content` (object, required)
- **Response data:** N/A

### `mark_read`

Send a read receipt / mark room as read.

- **Request data:**
  - `room_id` (string, required)
  - `event_id` (string, required)
  - `receipt_type` (string, required): Matrix receipt type (e.g. `m.read`).
- **Response data:** N/A

### `set_typing`

Set typing notification state.

- **Request data:**
  - `room_id` (string, required)
  - `timeout` (int): typing timeout in milliseconds. Set to 0 to stop typing.
- **Response data:** N/A

### `get_profile`

Fetch a Matrix user profile.

- **Request data:**
  - `user_id` (string, required)
- **Response data:** The raw profile data of the user.

### `set_profile_field`

Set one profile field for the current user.

- **Request data:**
  - `field` (string, required)
  - `value` (any, required)
- **Response data:** N/A

### `get_mutual_rooms`

Get rooms shared with a user.

- **Request data:**
  - `user_id` (string, required)
- **Response data:** `string[]` (array of room IDs)

### `track_user_devices`

Start tracking a user’s devices if they're not already tracked, then return
encryption info (same result as `get_profile_encryption_info`).

- **Request data:**
  - `user_id` (string, required)
- **Response data:** [`ProfileEncryptionInfo`](https://pkg.go.dev/go.mau.fi/gomuks/pkg/hicli/jsoncmd#ProfileEncryptionInfo)

### `get_profile_encryption_info`

Get the device list and trust state information for a user.

- **Request data:**
  - `user_id` (string, required)
- **Response data:** [`ProfileEncryptionInfo`](https://pkg.go.dev/go.mau.fi/gomuks/pkg/hicli/jsoncmd#ProfileEncryptionInfo)
  - `devices_tracked` (bool)
  - `devices` (array of `ProfileDevice`)
    - `device_id` (string)
    - `name` (string)
    - `identity_key` (string)
    - `signing_key` (string)
    - `fingerprint` (string)
    - `trust_state` (string)
  - `master_key` (string)
  - `first_master_key` (string)
  - `user_trusted` (bool)
  - `errors` (string[])

### `get_event`

Fetch an event from a room.

- **Request data:**
  - `room_id` (string, required)
  - `event_id` (string, required)
  - `unredact` (bool): if true, fetch an unredacted copy when possible.
- **Response data:** [`database.Event`](https://pkg.go.dev/go.mau.fi/gomuks/pkg/hicli/database#Event)

### `get_related_events`

Get events related to a given event (e.g. reactions, edits, replies depending on relation type).

- **Request data:**
  - `room_id` (string, required)
  - `event_id` (string, required)
  - `relation_type` (string, required)
- **Response data:** `database.Event[]` (array of events)

### `get_event_context`

Fetch context around an event (before/after timeline slices) from the homeserver.
This is used for jumping to a specific point on the timeline. Note that there is
currently no safe way to merge back into the main timeline, so jumping has to be
implemented as a separate view.

- **Request data:**
  - `room_id` (string, required)
  - `event_id` (string, required)
  - `limit` (int)
- **Response data:** https://pkg.go.dev/go.mau.fi/gomuks/pkg/hicli/jsoncmd#EventContextResponse
  - `start` (string)
  - `end` (string)
  - `before` (`database.Event[]`)
  - `after` (`database.Event[]`)
  - `event` (`database.Event`)

### `paginate_manual`

Manually paginate messages from the homeserver using a pagination token. This is
used to paginate after jumping to a specific event using `get_event_context` and
for normal pagination in the thread view.

- **Request data:**
  - `room_id` (string, required)
  - `thread_root` (string): root event ID for thread pagination.
  - `since` (string): `next_batch` token from previous request
    or the `start`/`end` fields of `get_event_context`.
  - `direction` (string): `b` or `f`.
  - `limit` (int)
- **Response data:** [`ManualPaginationResponse`](https://pkg.go.dev/go.mau.fi/gomuks/pkg/hicli/jsoncmd#ManualPaginationResponse)
  - `events` (`database.Event[]`)
  - `next_batch` (string)

### `get_room_state`

Get room state, optionally after fetching it from the homeserver.

- **Request data:**
  - `room_id` (string, required)
  - `refetch` (bool): force refetch the entire state from the homeserver.
  - `fetch_members` (bool): fetch membership events from homeserver. The client
    should always set this when opening a room if `has_member_list` is false in
    the room metadata.
  - `include_members` (bool): whether to include the member list in the response.
    This can be used with `fetch_members` to tell the backend to fetch the list
    in the background rather than waiting for it.
- **Response data:** `database.Event[]` (array of state events)

### `get_specific_room_state`

Get specific state events by database GUID keys.

- **Request data:**
  - `keys` (array, required): array of `database.RoomStateGUID`.
    - `room_id` (string, required)
    - `type` (string, required)
    - `state_key` (string)
- **Response data:** `database.Event[]` (array of state events)

### `get_receipts`

Get cached read receipts for a set of event IDs.

- **Request data:**
  - `room_id` (string, required)
  - `event_ids` (string[], required)
- **Response data:** map `event_id → Receipt[]`

### `paginate`

Paginate up in the timeline. This will return locally cached timelines if
available and fetch more from the homeserver if needed.

- **Request data:**
  - `room_id` (string, required)
  - `max_timeline_id` (number): the oldest known timeline row ID.
    All returned values will be lower than this (hence max ID).
  - `limit` (int)
  - `reset` (bool): if true, the backend will throw away any locally cached
    timeline state and reload it from the server.
- **Response data:** [`PaginationResponse`](https://pkg.go.dev/go.mau.fi/gomuks/pkg/hicli/jsoncmd#PaginationResponse)
  - `events` (`database.Event[]`)
  - `receipts` (map `event_id → Receipt[]`)
  - `related_events` (`database.Event[]`)
  - `has_more` (bool)
  - `from_server` (bool)

### `get_space_hierarchy`

Fetch a space hierarchy, which may include rooms the user isn't in yet. This
should only be used for rendering the space index page. For the room list,
space edge information is automatically pushed in syncs.

- **Request data:**
  - `room_id` (string, required)
  - `from` (string)
  - `limit` (int)
  - `max_depth` (int|null)
  - `suggested_only` (bool)
- **Response data:** [`mautrix.RespHierarchy`](https://pkg.go.dev/maunium.net/go/mautrix#RespHierarchy)

### `get_room_summary`

Fetch the basic metadata of a room, such as name, topic, avatar and member count.
This should be used for previewing rooms before joining. For joined rooms,
metadata is automatically pushed in the sync payloads.

- **Request data:**
  - `room_id_or_alias` (string, required)
  - `via` (string[])
- **Response data:** [`mautrix.RespRoomSummary`](https://pkg.go.dev/maunium.net/go/mautrix#RespRoomSummary)

### `join_room`

Join a room by room ID or alias.

- **Request data:**
  - `room_id_or_alias` (string, required)
  - `via` (string[])
  - `reason` (string)
- **Response data:** [`mautrix.RespJoinRoom`](https://pkg.go.dev/maunium.net/go/mautrix#RespJoinRoom)
  - `room_id` (string)

### `knock_room`

Knock on a room by room ID or alias.

- **Request data:**
  - `room_id_or_alias` (string, required)
  - `via` (string[])
  - `reason` (string)
- **Response data:** [`mautrix.RespKnockRoom`](https://pkg.go.dev/maunium.net/go/mautrix#RespKnockRoom)
  - `room_id` (string)

### `leave_room`

Leave a room or reject an invite.

- **Request data:**
  - `room_id` (string, required)
  - `reason` (string)
- **Response data:** empty object

### `create_room`

Create a new room.

- **Request data:** [`mautrix.ReqCreateRoom`](https://pkg.go.dev/maunium.net/go/mautrix#ReqCreateRoom)
- **Response data:** [`mautrix.RespCreateRoom`](https://pkg.go.dev/maunium.net/go/mautrix#RespCreateRoom)
  - `room_id` (string)

### `mute_room`

Mute or unmute a room by manipulating push rules.

- **Request data:**
  - `room_id` (string, required)
  - `muted` (bool)
- **Response data:** N/A

### `ensure_group_session_shared`

Ensure the encryption group session for a room has been shared to devices.
This should be called when the user first starts typing to make sending more
efficient.

- **Request data:**
  - `room_id` (string, required)
- **Response data:** N/A

### `send_to_device`

Send an arbitrary to-device event. Meant for widgets, not needed otherwise.

### `resolve_alias`

Resolve a room alias.

- **Request data:**
  - `alias` (string, required)
- **Response data:** [`mautrix.RespAliasResolve`](https://pkg.go.dev/maunium.net/go/mautrix#RespAliasResolve)
  - `room_id` (string)
  - `servers` (string[])

### `request_openid_token`

Request an OpenID token from the homeserver. OpenID tokens are used to
authenticate with various external services. Widgets also need this method.

To log into css.gomuks.app, use the response data to form the following URL and
open it in a browser: `https://css.gomuks.app/login?token=${access_token}&server_name=${matrix_server_name}`

- **Request data:** N/A
- **Response data:** [`mautrix.RespOpenIDToken`](https://pkg.go.dev/maunium.net/go/mautrix#RespOpenIDToken)
  - `access_token` (string)
  - `expires_in` (int)
  - `matrix_server_name` (string)
  - `token_type` (string)

### `discover_homeserver`

Discover the homeserver URL from a Matrix user ID using `.well-known` delegation.

- **Request data:**
  - `user_id` (string, required)
- **Response data:** [`mautrix.ClientWellKnown`](https://pkg.go.dev/maunium.net/go/mautrix#ClientWellKnown)

### `get_login_flows`

Fetch supported login flows from a homeserver.

- **Request data:**
  - `homeserver_url` (string, required)
- **Response data:** [`mautrix.RespLoginFlows`](https://pkg.go.dev/maunium.net/go/mautrix#RespLoginFlows)

### `login`

Log in using a homeserver URL, username, and password. After a successful login,
the `client_state` event will be dispatched. The frontend should use the event
rather than the response to update its state.

- **Request data:**
  - `homeserver_url` (string, required)
  - `username` (string, required)
  - `password` (string, required)
- **Response data:** N/A

### `login_custom`

Log in using a fully custom Matrix login request object.

- **Request data:**
  - `homeserver_url` (string, required)
  - `request` (object, [`mautrix.ReqLogin`](https://pkg.go.dev/maunium.net/go/mautrix#ReqLogin), required)
- **Response data:** `bool` (always `true` on success)

### `verify`

Verify the session using a recovery key or recovery phrase. Like login, the
frontend should update its state based on the `client_state` event rather than
the response here.

- **Request data:**
  - `recovery_key` (string, required)
- **Response data:** N/A

### `logout`

Log out the current session.

- **Request data:** N/A
- **Response data:** N/A

### `register_push`

Register a gomuks-specific pusher
Register (store) push configuration in gomuks’ local database.

- **Request data:** [`database.PushRegistration`](https://pkg.go.dev/go.mau.fi/gomuks/pkg/hicli/database#PushRegistration)
  - `device_id` (string, required): An arbitrary (but stable) device identifier.
  - `type` (string, required): One of `web`, `fcm`.
  - `data` (any, required): Type-specific data.
    - If `type` is `fcm`, `data` is a string containing the FCM push token.
    - If `type` is `web`, `data` is an object with the following fields:
      - `endpoint` (string, required)
      - `keys` (object, required)
        - `p256dh` (base64 string, required)
        - `auth` (base64 string, required)
  - `encryption` (object): An optional gomuks-specific encryption configuration.
    Mostly relevant for FCM (and APNs in the future), as web push has built-in
    encryption.
    - `key` (base64 string): 32 random bytes used as the static AES-GCM key.
  - `expiration` (int64, required): Unix timestamp (seconds) when the
    registration should be considered stale. The frontend should re-register
    well before this time.
- **Response data:** N/A

### `listen_to_device`

Enable or disable including to-device messages in sync data.
Only relevant for widgets.

- **Request data:** `bool`
- **Response data:** `bool` (previous value before this request)

### `get_turn_servers`

Fetch TURN server configuration.

- **Request data:** N/A
- **Response data:** [`mautrix.RespTurnServer`](https://pkg.go.dev/maunium.net/go/mautrix#RespTurnServer)

### `get_media_config`

Fetch media repository configuration.

- **Request data:** N/A
- **Response data:** [`mautrix.RespMediaConfig`](https://pkg.go.dev/maunium.net/go/mautrix#RespMediaConfig)

### `calculate_room_id`

Calculate a room ID locally from a timestamp and creation content. This is only
relevant when creating v12+ rooms with the `fi.mau.origin_server_ts` extension
that allows the client to pre-calculate the room ID.

- **Request data:**
  - `timestamp` (int64, required)
  - `content` (object, required): room creation content JSON.
- **Response data:** string

## Events (backend → client)

Events are messages sent by the backend when new data is available. The request
IDs will always be negative. The client MUST NOT respond to events.

### `sync_complete`

A sync batch has been fully processed and stored. This is also used for sending
the room list to the client when first connecting.

- **Event data:** `SyncComplete`
  - `since` (string)
  - `clear_state` (bool)
  - `account_data` (map)
  - `rooms` (map `room_id → SyncRoom`)
  - `left_rooms` (string[])
  - `invited_rooms` (array)
  - `space_edges` (map)
  - `top_level_spaces` (string[])
  - `to_device` (array)

### `sync_status`

Sync status update.

- **Event data:**
  - `type` (string, required): `ok`, `waiting`, `erroring`, `permanently-failed`
  - `error` (string)
  - `error_count` (int)
  - `last_sync` (number, unix milliseconds)

### `events_decrypted`

One or more events were decrypted after initially failing to decrypt.

- **Event data:**
  - `room_id` (string, required)
  - `preview_event_rowid` (number): If the preview event of the room changed,
    the new rowid to preview.
  - `events` (`database.Event[]`, required)

### `typing`

Typing notifications for a room.

- **Event data:**
  - `room_id` (string)
  - `user_ids` (string[])

### `send_complete`

A previously started send finished (success or failure).

- **Event data:**
  - `event` (`database.Event`)
  - `error` (string|null)

### `client_state`

Client state changed.

- **Event data:** `ClientState` (same as `get_state` response)

### `image_auth_token` (websocket only)

Authentication token for image/media requests. The token is valid for an hour
and a new one is sent every 30 minutes.

- **Event data:** string

### `init_complete`

Emitted after client initialization completes (either after initial sync or
after catching up on resume).

- **Event data:** `{}`

### `run_id`

Metadata about the currently running backend process.

- **Event data:**
  - `run_id` (string): The run ID to use for resuming connections
    (event buffering is in-memory, so connections can't be resumed across
    backend restarts).
  - `etag` (string): Used by the frontend to force reload if it detects it's an
    outdated cached copy.
  - `vapid_key` (string): VAPID public key for web push subscriptions.

