# End-to-bridge encryption
The bridge can optionally encrypt messages between Matrix users and the bridge
to hide messages from the homeserver. The use cases for this are:

* Storing messages encrypted on disk rather than in plaintext.
  * In unencrypted rooms, events are stored in plaintext in the homeserver database.
  * E2BE can be configured to delete keys immediately after encrypting/decrypting,
    which means the server being compromised in the future won't compromise old
    bridged messages.
* Preventing the server from seeing messages at all when bridges are hosted locally:
  * When using Beeper, you can self-host bridges locally and connect them to
    the Beeper servers. End-to-bridge encryption means the Beeper servers never
    see messages.
  * If you have your own homeserver on a cloud VPS, you can host bridges on
    a local raspberry pi or similar to ensure your cloud provider can't see
    messages.

Traffic from the bridge to remote network always follows the remote protocol
as if the bridge was a native client. For example, messages sent to Signal are
always encrypted between the bridge and Signal clients.

## Basic usage

To enable it, you must install the bridge with dependencies:
* For Python-based bridges, install the `e2be` [optional dependency](../python/optional-dependencies.md).
* For Go-based bridges, make sure the bridge is built with libolm.
  * CI binaries from mau.dev and release binaries on GitHub are always built with libolm.
* Docker images for all bridges always support encryption and don't need any special build flags.

After that, simply enable the option in the config (top-level `encryption` in
new bridges, `bridge` → `encryption` in old ones). If you only set `allow: true`,
the bridge won't enable encryption on its own, but will work in encrypted rooms.
If you also set `default: true`, the bridge will automatically enable encryption
in new portals.

If your homeserver is configured to forcibly enable encryption in rooms, you
must also set `default: true` in the bridge config. Force-enabling encryption
on the server side will not notify the bridge, so unless the bridge enables
encryption by default, the bridge will not find out that encryption was enabled.

## Appservice (/sync-less) mode

Setting `appservice: true` is not recommended, but should work as long as you're
using Synapse 1.141 or higher, v25.10 or higher of the bridge, and have enabled
the relevant experimental features in the homeserver config and appservice
registration. The registration flag is `org.matrix.msc3202: true` and the
Synapse experimental features are:

```yaml
experimental_features:
  msc3202_transaction_extensions: true
  msc2409_to_device_messages_enabled: true
```

## Use with next-gen auth (MAS, MSC4190)

The `encryption` -> `msc4190` config option must be set to true for encryption
to work if you use MAS.

You don't actually need to use next-gen auth to use MSC4190, so you can enable
it already before migrating to MAS to make sure bridges keep working. Enabling
MSC4190 is also recommended if you use the `self_sign` option, as it allows the
bridge to reset its cross-signing keys.

<details>
<summary>Instructions for legacy Synapses (pre-v1.141)</summary>

For Synapse versions prior to 1.141, you also need to set `io.element.msc4190: true`
in the bridge `registration.yaml` file, as well as enable the MSC3202 device
masquerading experimental feature:

```yaml
experimental_features:
  msc3202_device_masquerading: true
```

</details>

## Additional security

The bridges contain various additional options to configure how keys are handled.
For maximum security, you should set:

* `default: true` and `require: true` to reject any unencrypted messages.
* All fields **except** `delete_outbound_on_ack` under `delete_keys` to `true`
  to ratchet/delete keys immediately when they're no longer needed. This
  prevents the bridge (and bridge admin) from reading old messages.
* All fields under `verification_levels` to `cross-signed-tofu`. This means
  only devices with valid cross-signing verification can use the bridge.

Note that the `delete_keys` options may cause issues if your client is buggy.
In particular, if a client either uses an old megolm session after sharing a new
one or uses a megolm session past its expiry, the bridge will throw an error
saying `your client used an outdated encryption session`. If you want to use
such buggy clients, you should not enable any of the options under `delete_keys`.

## Legacy / manual registration instructions
If you want to use encryption in the standard /sync mode (as opposed to the
experimental appservice mode) and your registration file is extremely old
(pre-2021) or you created it manually instead of letting the bridge generate it,
you'll have to apply workarounds for Synapse bugs.

In particular, `sender_localpart` should be set to a random string. The value is
irrelevant as it's not used for anything, but the important thing is that it
must NOT be the bridge bot username. Instead, the bot user should be included in
the `users` namespace regexes, like so:

 ```yaml
sender_localpart: irrelevantrandomvalue
namespaces:
    users:
    - exclusive: true
      regex: '@telegram_.*:your\.homeserver'
    - exclusive: true
      regex: '@telegrambot:your\.homeserver'
 ```
