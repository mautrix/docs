# Troubleshooting & FAQ
Debugging setup issues should be done in the Matrix rooms for the bridges
(linked in the READMEs), rather than in GitHub issues. Additionally, this
page will collect some of the most common issues.

## Why is the bridge bot not accepting invites?
If the bridge starts up successfully, but inviting the bot doesn't work and the
logs don't show any errors, it usually means the homeserver isn't sending
events to the appservice. There are a few potential reasons this can happen:

* There was a misconfiguration in the appservice address/hostname/port config
  or the homeserver can't reach the appservice for some other reason. The
  homeserver logs should contain errors in this case (grep for `transactions` in
  Synapse's `homeserver.log`).
  * Note that grepping for `transactions` will show some data even when it's
    working correctly. If it shows nothing at all, something is broken.
  * Also note that `transaction` is not the same as `transactions`. If you don't
    include the `s` at the end, you'll get tons of unrelated logs.
* The bridge was down for longer than a few minutes and the homeserver backed
  off. The homeserver should retry after some time. If it still doesn't work
  after an hour or so (exact backoff depends on how long the bridge was down),
  check the homeserver logs.
* Synapse messed up and silently broke the appservice. ~~This is becoming
  relatively common, you should check [matrix-org/synapse#1834](https://github.com/matrix-org/synapse/issues/1834)
  if nothing else works.~~ This should be fixed as of Synapse v1.36.0.

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
