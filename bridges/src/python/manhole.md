# Manhole
**This feature is currently only present in mautrix-telegram, but it's intended 
to be extended to all other Python-based bridges eventually.**

The "manhole" allows server administrators to access a Python shell on a
running bridge. This is a very powerful mechanism for administration and
debugging.

To enable it, update the config and restart the bridge: set `manhole` ->
`enabled` to `true` and `manhole` -> `whitelist` to the list of system UIDs you
want to allow connecting. After that, send `open-manhole <uid>` to the bridge
bot on Matrix as a bridge admin user to open the manhole for the given UID.

When the manhole is open, you can open a connection with `nc -NU
/var/tmp/mautrix-telegram.manhole` in your normal shell. Optionally, install
`rlwrap` and use `rlwrap nc` instead of `nc` to get a nicer prompt. To use
`rlwrap` with Docker, run it on the host: `rlwrap docker exec -i nc -NU
/var/tmp/mautrix-telegram.manhole`. Alternatively, you can mount the socket to
the host and connect with the hosts netcat and rlwrap.

To close the connection, use `ctrl+C` or `exit()`. To close the manhole, use 
the `close-manhole` management command or use `bridge.manhole.close()` inside 
the manhole.

Inside the manhole, `bridge` refers to the main class instance. Refer to the 
source code to see how everything works. The manhole supports top-level `await`
expressions similar to `python -m asyncio`.
