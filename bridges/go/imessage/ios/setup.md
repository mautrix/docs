# iMessage bridge setup (iOS)

# DEPRECATED
mautrix-imessage has dropped support for 32-bit iOS devices, so this
Brooklyn-based bridge setup is now deprecated. Newer iOS-based devices can use
Barcelona (which is meant for macOS, but works on iOS). However, instructions
for Barcelona on iOS are not yet available here.

If you still want to use Brooklyn with an old iOS device, the last commit that
supports Go 1.14 and 32-bit iOS is [31bc6e28](https://github.com/mautrix/imessage/tree/31bc6e281841c85de15fb551ee90b77265e0c1fd)

---

Please note that everything in these docs are meant for server admins who want
to self-host the bridge. If you're just looking to use the bridges, check out
[Beeper], which provides fully managed instances of all of these bridges.

[Beeper]: https://www.beeper.com/

## Requirements
* A jailbroken iOS device, minimum and recommended is iPhone 4S with iOS 8.4(.1).
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/matrix-org/synapse)).
  You need access to register an appservice, which usually involves editing the homeserver config file.
* A [websocket proxy](https://github.com/mautrix/wsproxy) to receive
  appservice transactions.

## Installation
The bridge consists of two components: [Brooklyn] for connecting to iMessage
and mautrix-imessage for connecting to Matrix. The Brooklyn app runs
mautrix-imessage as a subprocess and they communicate over stdio.

The recommended way to install the app is getting a precompiled build from the
Cydia repo. You can technically also compile everything yourself, but that is
less documented.

[Brooklyn]: https://github.com/EthanRDoesMC/Brooklyn

### Compiling manually
There are instructions for compiling Brooklyn in the GitHub repo.

Compiling mautrix-imessage for darwin/armv7 is more complicated and not
currently documented. For more recent devices (i.e. armv8/arm64), it should
be as simple as compiling mautrix-imessage on a Mac with Apple Silicon.

### Precompiled builds
You can get the Brooklyn app with a bundled mautrix-imessage from the Cydia
repo. The repo is currently available at <http://maunium.mau.life/brooklyn/>
(repo URL subject to change). After adding the repo in Cydia, simply install
the "Brooklyn" package from the repo.

## Configuring and running
1. Get the [example config] and fill it out. You'll at least need to:
   * Fill everything in the `homeserver` section.
   * Set `bridge` -> `user` to your MXID.
   * Change `imessage` -> `platform` to `ios`.
   * Generate random tokens for the `as_token` and `hs_token` fields.
2. Get the [example registration] and copy the relevant values from the config.
3. Set up [mautrix-wsproxy](https://github.com/mautrix/wsproxy).
4. Register the bridge on your homeserver (see [Registering appservices]).
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

[example config]: https://github.com/mautrix/imessage/blob/master/example-config.yaml
[example registration]: https://github.com/mautrix/imessage/blob/master/example-registration.yaml
[a bug in Brooklyn]: https://github.com/EthanRDoesMC/Brooklyn/issues/5
[Registering appservices]: ../../../general/registering-appservices.md

## Troubleshooting

*The brooklyn app keeps showing the QR Code reader popup*
1. Connect your iPhone to a Mac and open the Console app to see logs
2. Filter for "Brooklyn" to see logs
3. If you see `Brooklyn	 mautrix-imessage sent error:Failed to download config: failed to open config.yaml for writing config: open config.yaml: permission denied`, use the following to mitigate:
    1. install OpenSSH via Cydia
    2. ssh to the iPhone (find out IP via settings, user is root, password is alpine)
    3. the first ssh will take minutes because SSH keys are generated
    4. once you are ssh'ed into your phone, run chmod 777 /var/mobile/Documents/mautrix-imessage-armv7
    5. scan QR Code again
    6. check that the config file downloaded by running the following over SSH on your iPhone: `cat /var/mobile/Documents/mautrix-imessage-armv7/config.yaml`
 4. If you are seeing `[ERROR] Error in appservice websocket: failed to open websocket: dial tcp [::1]:29331: connect: connection refused` that means that your phone cannot talk to `mautrix-wsproxy`, make sure that the configured value for homeserver -> websocket_proxy can be resolved from your phone. You can check this by installing `netcat` in Cydia and then running the following over ssh: `nc -zv <hostname> 29331` to see if it connects
