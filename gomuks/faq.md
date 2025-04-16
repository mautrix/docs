# FAQ
**N.B.** These only apply to gomuks legacy unless otherwise noted.

## How do I verify the gomuks session?
To self-sign the device using your security key, use `/cs fetch`, enter your
security key in the dialog that appears, then use `/cs self-sign`.

Alternatively, find yourself in the user list on Element Web or Desktop, click
on "X sessions", click on the gomuks session and use "Manually verify by text",
then compare the fingerprint to what gomuks outputs with the `/fingerprint`
command. Note that the text verification option is not available in the
security & privacy settings, it's only in the right panel user list.

## Why are old messages undecryptable?
gomuks currently doesn't support key backup and doesn't request keys
automatically, so only messages sent after initial login will be decryptable.
To see older messages, export keys to file from another client and use the
`/import` command. After importing keys, you need to clear cache to have gomuks
retry decrypting old messages.

## How do I use a proxy?
Go's HTTP library reads the `https_proxy` environment variable by default
(see <https://pkg.go.dev/net/http#ProxyFromEnvironment> for more info).

## How do I copy text from gomuks?
Most terminals allow selecting text even when mouse mode is enabled by using
shift+drag. However, that way doesn't work for copying multiline text, so you
may prefer the `/copy` command for copying a single message, or
<kbd>Ctrl</kbd>+<kbd>L</kbd> to enter plaintext mode where you can copy
whatever you want.

## Can I use gomuks with multiple accounts?
gomuks currently only supports one account at a time, but you can run multiple
instances of gomuks with different data directories. See the entry below for
details.

## Debug logs
To get debug logs from gomuks, launch it with `DEBUG=1` in the environment.
Logs will be stored in `~/.local/state/gomuks` by default. Prior to v0.3.1,
the default path was `/tmp/gomuks`. The path can be changed using the `DEBUG_DIR`
environment variable.

## Where does gomuks store data?
By default, data is stored in the default config/cache/data directories using
OS-specific conventions. To store all gomuks data in a custom directory, use
the `GOMUKS_ROOT` environment variable.

You can also override individual directories using `GOMUKS_THING_HOME` (where
`THING` is `CONFIG`, `DATA` or `CACHE`).

* Config contains the main local config file.
* Data contains encryption keys.
* Cache contains things that can be refetched from the server: message history,
  room state, automatically downloaded files, preferences that are synced to
  the server, etc.

The default directory for manual file downloads (using the `/download` command)
is the same on all systems: `$GOMUKS_DOWNLOAD_HOME`, `$(xdg-user-dir DOWNLOAD)`,
or `$HOME/Downloads`.

Note that the environment variables only take effect before first startup.
After first startup, everything except the config path is saved to the config
and will be read from there. To move existing gomuks data to a different path,
you must change the paths in the config file.

### Storage in gomuks web
The `GOMUKS_*` environment variables work mostly the same way as gomuks legacy,
with a few exceptions:

* There's no /download command and therefore no DOWNLOAD_HOME
* Data also contains message history and other Matrix state, not only
  encryption keys (but media is still in cache).
* Logs can be redirected using `GOMUKS_LOG_HOME` instead of `DEBUG_DIR`.
* Environment variables are read on every startup, the paths aren't baked into
  the config file, except for the log path.

### System-specific defaults
These are the base directories for each OS, data will be stored in the `gomuks`
directory inside each base directory.

#### *nix
* Config: `$XDG_CONFIG_HOME` or `$HOME/.config`
* Cache: `$XDG_CACHE_HOME` or `$HOME/.cache`
* Data: `$XDG_DATA_HOME` or `$HOME/.local/share`
* Logs: `$XDG_STATE_HOME` or `$HOME/.local/state`

#### macOS
* Config & Data: `$HOME/Library/Application Support`
* Cache: `$HOME/Library/Caches`
* Logs: `$HOME/Library/Logs`

#### Windows
* Config & Data: `%AppData%`
* Cache: `%LocalAppData%`
* Logs: `%LocalAppData%`
