# End-to-bridge encryption
The bridge can optionally encrypt messages between Matrix users and the bridge
to hide messages from the homeserver. Using Postgres is strongly recommended
when using end-to-bridge encryption.

To enable it, you must install the bridge with dependencies:
* For Python-based bridges, install the `e2be` [optional dependency](../python/optional-dependencies.md).
* For Go-based bridges, make sure the bridge is built with libolm.

After that, simply enable the option in the config (`bridge` → `encryption`).
If you only set `allow: true`, the bridge won't enable encryption on its own,
but will work in encrypted rooms. If you also set `default: true`, the bridge
will automatically enable encryption in new portals.

You should **not** set `appservice: true` at the moment, as the Synapse
implementation is still incomplete and has not been tested with the bridges.

Note that end-to-bridge encryption does not currently work on Dendrite nor
Conduit as they don't implement the necessary parts of the spec. The critical
missing piece is tracked in [matrix-org/dendrite#2723] and [famedly/conduit#321].

[matrix-org/dendrite#2723]: https://github.com/matrix-org/dendrite/issues/2723
[famedly/conduit#321]: https://gitlab.com/famedly/conduit/-/issues/321

## Legacy registration file workaround
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
