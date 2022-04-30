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
* The bridge was down for longer than a few minutes and the homeserver backed
  off. The homeserver should retry after some time. If it still doesn't work
  after an hour or so (exact backoff depends on how long the bridge was down),
  check the homeserver logs.

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
[MSC2199]: https://github.com/matrix-org/matrix-doc/pull/2199

## How do I bridge typing notifications and read receipts?
Bridging ephemeral events (EDUs) is enabled by default in the bridges, but
currently those events aren't sent to appservices by default. There are two
config options to enable the bridges to receive EDUs:

1. `bridge` -> `sync_with_custom_puppets` - calls `/sync` with your Matrix
   account to receive EDUs. See the [double puppeting] docs for how to enable
   double puppeting in general.
2. `appservice` -> `ephemeral_events` - enables [MSC2409] support to have the
   homeserver push EDUs directly to the bridge (the same way it pushes normal
   messages).
   * This is currently only implemented in Synapse.
   * This also requires the `de.sorunome.msc2409.push_ephemeral` field in the
     registration file to be set to `true`. If you regenerate the registration
     after enabling the config option, the relevant fields will be added
     automatically. Remember to restart Synapse after updating the registration.

You should only have one of the two enabled at any time.

[MSC2409]: https://github.com/matrix-org/matrix-doc/pull/2409

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

## Signal: Identity failure occurred while sending message to +phone
This error happens if the remote user's encryption identity changed (e.g. if
they reinstalled Signal). In groups, it usually means one or more of the
participants changed devices, but the message was still sent to everyone else.

To solve it, you can either use `!signal safety-number +phone` and then copy
the safety number to the `mark-trusted` command, or you can run signald with
the `--trust-new-keys` and `--trust-all-keys-on-start` CLI options to have it
automatically trust new key. See <https://signald.org/articles/config/> for
more info on those options.

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

## `[CRITICAL@mau.init] Configuration error: <field> not configured`
You didn't change the value of `<field>` in the config, but that field must be
configured for the bridge to work (i.e. the default value will not work). Dots
in `<field>` mean nesting, e.g. `bridge.permissions` means the `permissions`
field inside the `bridge` object.

## The `as_token` was not accepted
This error means you either:

* didn't add the path to the registration file to the homeserver config,
* didn't restart the homeserver after adding the path to the config, or
* modified the tokens somewhere and didn't copy them to the other file

Make sure the tokens match everywhere, that you're looking at the right files,
and that everything has been restarted.

## The `as_token` was accepted, but the `/register` request was not
This can happen if you either misconfigure the `homeserver` -> `domain` field,
or change the `username_template` without regenerating the registration.

Usually it's the former, so make sure that the `domain` field matches your
homeserver's `server_name` exactly. If it doesn't, fix it, regenerate the
registration file and restart everything.
