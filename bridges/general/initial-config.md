# Initial bridge config
These bridges contain quite a lot of configuration options. This page is meant
to help with finding the important ones that must be changed when setting up
a bridge, as well as highlight some options that are usually useful.

For information about fields not mentioned here, refer to the comments in the
config itself. The config is designed to be self-documenting and the bridge will
also keep it up to date by rewriting the config on every startup by default.

If you disable the config rewriting, you can also find the example configs here:

* [mautrix-gmessages](https://docs.mau.fi/configs/mautrix-gmessages/latest)
* [mautrix-whatsapp](https://docs.mau.fi/configs/mautrix-whatsapp/latest)
* [mautrix-telegram](https://docs.mau.fi/configs/mautrix-telegram/latest) (go rewrite only)
* [mautrix-linkedin](https://docs.mau.fi/configs/mautrix-linkedin/latest)
* [mautrix-bluesky](https://docs.mau.fi/configs/mautrix-bluesky/latest)
* [mautrix-twitter](https://docs.mau.fi/configs/mautrix-twitter/latest)
* [mautrix-gvoice](https://docs.mau.fi/configs/mautrix-gvoice/latest)
* [mautrix-signal](https://docs.mau.fi/configs/mautrix-signal/latest)
* [mautrix-slack](https://docs.mau.fi/configs/mautrix-slack/latest)
* [mautrix-zulip](https://docs.mau.fi/configs/mautrix-zulip/latest)
* [mautrix-meta](https://docs.mau.fi/configs/mautrix-meta/latest)
* [mautrix-irc](https://docs.mau.fi/configs/mautrix-irc/latest)

## Mandatory fields
When setting up a bridge, some fields have default example values, and must be
changed to match your setup. The bridge simply won't work without them, and if
you forget any of them, the bridge won't start up successfully and will print
errors in logs.

* `homeserver` -> `address` - the address that the bridge can use to connect to
  your homeserver (like Synapse or Conduit). This should usually be a localhost
  or internal docker network address (like `http://localhost:8008` or `http://synapse:8008`).
  * If you use workers, then it should probably point at your reverse proxy,
    but you can still configure your reverse proxy to expose a local non-TLS
    interface with the same routing rules as the public TLS interface.
* `homeserver` -> `domain` - the domain of the homeserver. This is always the
  same as `server_name` in the homeserver config, it is not affected by any
  reverse proxies, docker networking or other such things.
* If you're using Docker, you'll have to change `appservice` -> `address` too.
  That address is what the homeserver will use to connect to the bridge.
  `localhost` won't work in Docker, but container names do
  (e.g. `http://mautrixbridge:29318`), as long as the bridge and homeserver are
  in the same Docker network.
  * Note that the `address` field only affects the generated registration file.
    The host/port where the bridge listens are the two fields below address,
    but those usually don't need to be changed.
* The database config has an example postgres URI, which obviously won't work.
  You can either point it at a real Postgres database, or change it to use
  SQLite. Postgres is recommended if you have multiple users, but SQLite is
  fine for small instances.
  * Never point the bridge at another program's (like synapse's) database.
    When using Postgres, you can create a new database in an existing Postgres
    instance.
* In `bridge` -> `permissions`, you'll have to change the examples to match
  your server.

### Bridge-specific mandatory fields
#### mautrix-telegram
The Telegram bridge requires that you create an "app" at <https://my.telegram.org/apps>
and provide the `api_id` and `api_hash` in the config. Telegram is often picky
about the details you provide and will just give a generic `ERROR` popup. If
that happens, try changing the values around until it works. URL and description
seem to be optional, names probably work best if they don't include `telegram`.

API keys don't grant access to any Telegram account, they're just required to
connect to the API in the first place. Login happens afterwards using bridge
commands. The bridge can be used to log into any account regardless of whose
account the API keys were created on.

#### mautrix-meta
The Meta bridge is effectively two bridges in one codebase: Facebook Messenger
and Instagram DMs. By default, it'll let you log into any type of account.
Optionally, you can limit it to a single type to have separate bridges for
Messenger and Instagram. If doing so, you might also want to change the fields
listed below to customize the bridge bot appropriately for the service you're
using.

<details>
<summary>List of fields</summary>

* `network` -> `mode`
* `appservice` -> `id`
* `appservice` -> `bot` -> `username`
* `appservice` -> `bot` -> `displayname`
* `appservice` -> `bot` -> `avatar`
  * Instagram: `mxc://maunium.net/JxjlbZUlCPULEeHZSwleUXQv`
  * Messenger: `mxc://maunium.net/ygtkteZsXnGJLJHRchUwYWak`
  * Facebook: `mxc://maunium.net/uvPDxOQGCvGbPsYDiuHlNiiE`
* `appservice` -> `username_template`

If you're duplicating an already-working bridge config, also remember to change
the appservice port and database URI (you can't share one database for two
bridges). The `as_token` and `hs_token` will be regenerated when you generate
a new registration.

</details>

## Other useful things

* Setting up [double puppeting] is strongly recommended. The relevant config
  field for automatic double puppeting is `double_puppet` -> `secrets`.
  * If you only set it up for your own server, you don't need to touch
    the `servers` map, that's only for remote servers.
* [End-to-bridge encryption] works best if set up before logging into the
  bridge, because there's currently no proper way to enable encryption in
  existing rooms.
* Most bridges have some automatic portal creation and [message backfill],
  so checking the `bridge` -> `backfill` section is recommended. Backfilling
  after creating rooms is not possible, so it has to be configured to your
  liking before logging in.
  * Related to backfill, most bridges also have options to specify how many
    chats to backfill initially. Those options are under the `network` section.

[double puppeting]: https://docs.mau.fi/bridges/general/double-puppeting.html
[End-to-bridge encryption]: https://docs.mau.fi/bridges/general/end-to-bridge-encryption.html
[message backfill]: https://docs.mau.fi/bridges/general/backfill.html
