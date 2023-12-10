# Initial bridge config
These bridges contain quite a lot of configuration options. This page is meant
to help with finding the important ones that must be changed when setting up
a bridge, as well as highlight some options that are usually useful.

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
* Way below in `bridge` -> `permissions`, you'll have to change the examples
  to match your server.

## Other useful things

* Setting up [double puppeting] is strongly recommended. The relevant config
  field for automatic double puppeting is `bridge` -> `login_shared_secret_map`.
  * If you only set it up for your own server, you don't need to touch
    `double_puppet_server_map`, that's only for remote servers.
  * For the bridges that sync favorite/pin/archive/mute status, you can enable
    that part with the `pinned_tag`/`archive_tag`/`mute_bridging` config options.
* [End-to-bridge encryption] works best if set up before logging into the
  bridge, because there's currently no proper way to enable encryption in
  existing rooms.
* Most bridges have some automatic portal creation and [message backfill],
  so checking the `backfill` or `history_sync` config section under `bridge`
  is recommended. Backfilling after creating rooms is not possible, so it has
  to be configured to your liking before logging in.
  * Related to backfill, most bridges also have options to specify how many
    chats to backfill initially. Those options may be under backfill config,
    or separately inside the bridge section.

[double puppeting]: https://docs.mau.fi/bridges/general/double-puppeting.html
[End-to-bridge encryption]: https://docs.mau.fi/bridges/general/end-to-bridge-encryption.html
[message backfill]: https://docs.mau.fi/bridges/general/backfill.html
