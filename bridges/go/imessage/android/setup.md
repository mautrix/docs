# ~~iMessage~~ SMS bridge setup (Android)
In addition to being an iMessage bridge, mautrix-imessage can run on Android to
bridge SMS messages from your phone. The Android SMS bridge works similar to
the [jailbroken iOS setup], but instead of Brooklyn, the wrapper app for the
bridge is [android-sms].

Please note that everything in these docs are meant for server admins who want
to self-host the bridge. If you're just looking to use the bridges, check out
[Beeper], which provides fully managed instances of all of these bridges.

[jailbroken iOS setup]: ../ios/setup.md
[android-sms]: https://gitlab.com/beeper/android-sms
[Beeper]: https://www.beeper.com/

## Requirements
* An Android device with Android 5 or higher.
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/matrix-org/synapse)).
  You need access to register an appservice, which usually involves editing the homeserver config file.
* A [websocket proxy](https://github.com/mautrix/wsproxy) to receive
  appservice transactions. If you want end-to-bridge encryption, the [sync
  proxy] component (mentioned in the websocket proxy readme) is also recommended
  to minimize battery usage.

[sync proxy]: https://github.com/mautrix/syncproxy

## Installation

### Compiling manually
1. Install the latest Android SDK and NDK version 21.3.6528147.
2. Clone the android-sms repo. Use `--recursive` when cloning or
   `git submodule init && git submodule update` after cloning to ensure that
   the mautrix-imessage submodule is present.
3. Run `./mautrix.sh` to compile mautrix-imessage for Android.
4. Put your `config.yaml` in `app/src/main/assets/` (create the directory
   if it doesn't exist).
5. Run `./gradlew installDebug` to compile the app and install it over ADB.

### Precompiled builds
There are currently no precompiled versions available, as the config must be
bundled at compile time. Support for setting up with QR code similar to the iOS
setup will be added soon(™), and precompiled APKs will be available in the
GitLab CI after that.

## Configuring and running
1. Get the [example config] and fill it out. You'll at least need to:
   * Fill everything in the `homeserver` section.
   * Set `bridge` -> `user` to your MXID.
   * Change `imessage` -> `platform` to `android`.
   * Generate random tokens for the `as_token` and `hs_token` fields.
   * The database and log directory paths must be absolute paths in the
     `/data/user/0/com.beeper.sms.app` directory.
2. Get the [example registration] and copy the relevant values from the config.
3. Set up [mautrix-wsproxy](https://github.com/mautrix/wsproxy)
   (and the [sync proxy](https://github.com/mautrix/syncproxy)).
4. Add the path to the registration file to your Synapse `homeserver.yaml`
   under `app_service_config_files`, then restart Synapse.
5. Build and run the android-sms app with your config.
6. Open the app and grant it SMS permissions to start the bridge.

<!--
5. Serve the config file with the webserver of your choice. It's recommended
   to use a random file name or add HTTP basic auth to prevent other people
   from reading your config.
   * HTTP basic auth documentation:
     [Caddy](https://caddyserver.com/docs/caddyfile/directives/basicauth),
     [nginx](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/),
     [Apache](https://httpd.apache.org/docs/2.4/howto/auth.html)
6. Generate a QR code with the URL to your config
   (e.g. `echo -n https://user:pass@example.com/your-config.yaml | qrencode -t ansiutf8`).
7. Scan the QR code with android-sms.
-->

[example config]: https://github.com/mautrix/imessage/blob/master/example-config.yaml
[example registration]: https://github.com/mautrix/imessage/blob/master/example-registration.yaml

If something is wrong and you need to view the bridge logs, use logcat:

```
adb logcat --pid=$(adb shell ps | grep com.beeper.sms.app | awk '{ print $2 }')
```

(note that the pid will change if the app is restarted, so you'll have to
re-run the command after restarts)
