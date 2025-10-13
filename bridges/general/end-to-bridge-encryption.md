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

You should **not** set `appservice: true` at the moment, as the Synapse
implementation is still incomplete and has not been tested with the bridges.

## Use with next-gen auth (MAS, MSC4190)

The `encryption` -> `msc4190` config option must be set to true. After that,
you can either regenerate the registration, or manually add the required field:
`io.element.msc4190: true`. Finally, MSC3202 device masquerading must be enabled
on the server side, which means the following Synapse config:

```yaml
experimental_features:
  msc3202_device_masquerading: true
```

You don't actually need to use next-gen auth to use MSC4190, so you can enable
it already before migrating to MAS to make sure bridges keep working.

Note: on Synapse 1.141 and higher, the `msc3202_device_masquerading` and
`io.element.msc4190` flags are no longer necessary. However, you must still set
`msc4190: true` in the bridge config.

## Additional security

The bridges contain various additional options to configure how keys are handled.
For maximum security, you should set:

* `default: true` and `require: true` to reject any unencrypted messages.
* All fields **except** `delete_outbound_on_ack` under `delete_keys` to `true`
  to ratchet/delete keys immediately when they're no longer needed. This
  prevents the bridge (and bridge admin) from reading old messages.
* All fields under `verification_levels` to `cross-signed-tofu`. This means
  only devices with valid cross-signing verification can use the bridge.

## Legacy instructions

<details>
<summary>Legacy registration file workaround</summary>

In mautrix-telegram v0.8.0 release candidates, you had to manually apply a
workaround for [MSC2190](https://github.com/matrix-org/matrix-spec-proposals/pull/2190).
In newer versions (mautrix-telegram v0.8.0+, mautrix-python v0.5.0-rc3+) the
workaround is applied automatically to all newly generated registration files.
For old registration files, you can either regenerate the file or apply the
workaround manually:

1. Change `sender_localpart` in the registration to something else.
   Any random string will do.
2. Add a new entry in the `users` array for the bridge bot (the previous value
   of `sender_localpart`). If you used the default `telegrambot`, the result
   should look something like this:
   ```yaml
   namespaces:
       users:
       - exclusive: true
         regex: '@telegram_.+:your.homeserver'
       - exclusive: true
         regex: '@telegrambot:your.homeserver'
   ```
3. <del>Using the `as_token`, make a call to register the bot user. It's fine
   if this says the user is already in use.</del> This step only applies to new
   bridges, but new bridges don't need to do this workaround.
   ```shell
   $ curl -H "Authorization: Bearer <as_token>" -d '{"username": "telegrambot"}' -X POST https://your.homeserver/_matrix/client/r0/register?kind=user
   ```

</details>
