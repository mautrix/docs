# FAQ

## Can I connect to a remote gomuks backend?
Yes, the recommended way to do it is to run the backend behind a reverse proxy
(see entry below). It is possible to connect directly without a reverse proxy,
but LANs are dangerous, so using TLS is recommended, which requires a reverse
proxy.

If you really don't want to use TLS, you'll have to set `insecure_cookies` in
the config to allow connecting from an insecure context. By default, the auth
cookie will only work on localhost and https sites.

`listen_address` and `origin_patterns` have to be changed to allow connecting
from non-localhost addresses.

## Can I run the backend behind a reverse proxy?
Yes, `origin_patterns` just needs to be changed to match what the client will
use to connect to. `listen_address` may also need to be changed if using
something like Docker where the reverse proxy can't connect using localhost.

If you want to use custom auth instead of the standard basic auth, you can
either have your reverse proxy inject it, or use the [secret config option]
to disable auth entirely in the backend. When disabling auth, you need to be
extra careful not to allow untrusted requests to the backend.

[secret config option]: https://github.com/gomuks/gomuks/blob/v0.2603.0/pkg/gomuks/config.go#L70

## Can I use gomuks with multiple accounts?
gomuks currently only supports one account at a time, but you can run multiple
instances of gomuks with different data directories. See the entry below for
details.

If you aren't using a reverse proxy, you'll have to use different ports and
localhosts to access the gomukses to avoid cookie conflicts. The port can be
changed in the config. All modern browsers should force `anything.localhost`
to connect to localhost, so you could use `http://main.localhost:8000` and
`http://anotheraccount.localhost:8001` for example.

## Where does gomuks store data?
By default, data is stored in the default config/cache/data directories using
OS-specific conventions. To store all gomuks data in a custom directory, use
the `GOMUKS_ROOT` environment variable.

You can also override individual directories using `GOMUKS_THING_HOME` (where
`THING` is `CONFIG`, `DATA` or `CACHE`).

* Config contains the config file with things like listen address,
  basic auth credentials and log config.
* Data contains all persistent data (messages, encryption keys, etc).
  Deleting the data directory will log you out.
* Cache contains media and can be safely deleted at any time. The cache is
  content-addressed, so it can also be shared between multiple gomuks instances.

`GOMUKS_LOG_HOME` can also be used to redirect logs, but the variable is only
read on first startup and then baked into the config file.

### Legacy gomuks
In legacy gomuks, data only contains encryption keys and everything else is in
the cache directory. Clearing the cache directory will resync everything from
the server.

Legacy gomuks also has a download directory, for the `/download` command. It's
the same on all systems: `$GOMUKS_DOWNLOAD_HOME`, `$(xdg-user-dir DOWNLOAD)`,
or `$HOME/Downloads`.

After first startup on legacy gomuks, everything except the config path is saved
to the config and will be read from there. To move existing gomuks data to a
different path, you must change the paths in the config file.

Logs on legacy gomuks are stored in `DEBUG_DIR` rather than `GOMUKS_LOG_HOME`.

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

## How do I use a proxy?
Go's HTTP library reads the `https_proxy` environment variable by default
(see <https://pkg.go.dev/net/http#ProxyFromEnvironment> for more info).

---
The FAQ entries below only apply to legacy gomuks

## How do I verify the gomuks session?
To self-sign the device using your security key, use `/cs fetch`, enter your
security key in the dialog that appears, then use `/cs self-sign`.

Alternatively, get your fingerprint and device ID from `/fingerprint` and pass
them to the `/verify` command in an up-to-date Element Web or Desktop to do
manual verification.

## Why are old messages undecryptable?
gomuks currently doesn't support key backup and doesn't request keys
automatically, so only messages sent after initial login will be decryptable.
To see older messages, export keys to file from another client and use the
`/import` command. After importing keys, you need to clear cache to have gomuks
retry decrypting old messages.

## How do I copy text from gomuks?
Most terminals allow selecting text even when mouse mode is enabled by using
shift+drag. However, that way doesn't work for copying multiline text, so you
may prefer the `/copy` command for copying a single message, or
<kbd>Ctrl</kbd>+<kbd>L</kbd> to enter plaintext mode where you can copy
whatever you want.

## Debug logs
To get debug logs from gomuks, launch it with `DEBUG=1` in the environment.
Logs will be stored in `~/.local/state/gomuks` by default. Prior to v0.3.1,
the default path was `/tmp/gomuks`. The path can be changed using the `DEBUG_DIR`
environment variable.
