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

When using the Electron wrapper, you can have the wrapper run multiple backends
internally and display an in-app switcher for them. There's no UI for adding
accounts yet though, so you have to define them manually in the config file
(again, see the entry below).

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

`GOMUKS_LOGS_HOME` can also be used to redirect logs, but the variable is only
read on first startup and then baked into the config file.

### Electron wrapper
The Electron gomuks desktop stores backend data under the default Electron
session data directory, which means `~/.config/gomuks-desktop` on Linux and
`~/Library/Application Support/gomuks-desktop` on macOS.

The config for the Electron side is in `gomuks-desktop.json`, which is where
backends are defined. All backend entries must have `type` (`embedded` or
`remote`) and a unique `name`. Remote backends must also have `address`
and optionally `username` and `password`. All backends can have `displayname`
to use in the account picker.

Each embedded backend has its own subdirectory named after the `name` field in
the config. The media cache is shared by all backends and will be in the
`gomuks-cache` subdirectory.

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

## Where are the legacy gomuks docs
Legacy gomuks is no longer supported. You can find the old docs in the git
history of the mautrix/docs repo:
<https://github.com/mautrix/docs/tree/a904952822e967c3f71c2a75d1e2bf904f167db2/gomuks>
