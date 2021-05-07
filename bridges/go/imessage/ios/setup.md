# iMessage bridge setup (iOS)
## Requirements
* A jailbroken iOS device, minimum and recommended is iPhone 4S with iOS 8.4(.1).
* A Matrix homeserver that supports application services
  (e.g. [Synapse](https://github.com/matrix-org/synapse)).
* A [websocket proxy](https://github.com/tulir/mautrix-wsproxy) to receive
  appservice transactions.

## Installation
The bridge consists of two components: [Brooklyn] for connecting to iMessage
and mautrix-imessage for connecting to Matrix. The Brooklyn app runs
mautrix-imessage as a subprocess and they communicate over stdio.

The recommended way to install the app is getting a precompiled build from the
Cydia repo. You can technically also compile everything yourself, but that is
less documented.

[Brooklyn]: https://gitlab.com/beeper/brooklyn

### Compiling manually
There are instructions for compiling Brooklyn in the GitLab repo.

Compiling mautrix-imessage for darwin/armv7 is more complicated and not
currently documented. For more recent devices (i.e. armv8/arm64), it should
be as simple as compiling mautrix-imessage on a Mac with Apple Silicon.

### Precompiled builds
You can get the Brooklyn app with a bundled mautrix-imessage from the Cydia
repo. The repo is currently available at <http://beeper.gitlab.io/brooklyn/>.
After adding the repo in Cydia, simply install the "Brooklyn" package from
the repo.

## Configuring and running
1. Get the [example config] and fill it out. You'll at least need to:
   * Fill everything in the `homeserver` section.
   * Set `bridge` -> `user` to your MXID.
   * Change `imessage` -> `platform` to `ios`.
   * Generate random tokens for the `as_token` and `hs_token` fields.
2. Get the [example registration] and copy the relevant values from the config.
3. Set up [mautrix-wsproxy](https://github.com/tulir/mautrix-wsproxy).
4. Add the path to the registration file to your Synapse `homeserver.yaml`
   under `app_service_config_files`, then restart Synapse.
5. Serve the config file with the webserver of your choice. It's recommended
   to use a random file name or add HTTP basic auth to prevent other people
   from reading your config.
   * HTTP basic auth documentation:
     [Caddy](https://caddyserver.com/docs/caddyfile/directives/basicauth),
     [nginx](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/),
     [Apache](https://httpd.apache.org/docs/2.4/howto/auth.html)
   * **N.B.** Due to [a bug in Brooklyn], the URL must be lowercase.
6. Generate a QR code with the URL to your config
   (e.g. `echo -n https://user:pass@example.com/your-config.yaml | qrencode -t ansiutf8`).
7. Scan the QR code with Brooklyn.

[example config]: https://github.com/tulir/mautrix-imessage/blob/master/example-config.yaml
[example registration]: https://github.com/tulir/mautrix-imessage/blob/master/example-registration.yaml
[a bug in Brooklyn]: https://gitlab.com/beeper/brooklyn/-/issues/7
