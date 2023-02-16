# iMessage bridge setup (macOS)
Please note that everything in these docs are meant for server admins who want
to self-host the bridge. If you're just looking to use the bridges, check out
[Beeper], which provides fully managed instances of all of these bridges.

[Beeper]: https://www.beeper.com/

## Requirements
* A computer running a reasonably new version of macOS.
  * The bridge requires full disk access in privacy settings to read your chat
    database.
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/matrix-org/synapse)).
  You need access to register an appservice, which usually involves editing the homeserver config file.
* A [websocket proxy](https://github.com/mautrix/wsproxy) to receive
  appservice transactions.

If you want to compile the bridge manually (which is not required), you'll also need:

* Go 1.19+ (download & installation instructions at <https://go.dev/doc/install>).
* libolm3 with dev headers (`brew install libolm`).
* Optionally libheif with dev headers for heif -> jpeg conversion (`brew install libheif`).

## Installation
You may either compile the bridge manually or download a prebuilt executable
from the mau.dev CI.

### Compiling manually
1. Clone the repo with `git clone https://github.com/mautrix/imessage.git`.
2. Enter the directory (`cd mautrix-imessage`).
3. Run `./build.sh` to fetch Go dependencies and compile
   ([`build.sh`](https://github.com/mautrix/imessage/blob/master/build.sh)
   will simply call `go build` with some additional flags).

### Downloading a prebuilt executable
1. Go to <https://mau.dev/mautrix/imessage/pipelines?scope=branches&page=1>
2. Find the entry for the `master` branch and click the download button on the
   right-hand side in the list.
   * There are three entries: universal, arm64 (Apple Silicon) and amd64 (Intel).
     You can either pick universal, or the specific architecture depending on
     what Mac you have.
3. Extract the downloaded zip file into a new directory.

## Configuring and running
1. Copy `example-config.yaml` to `config.yaml`
2. Update the config to your liking.
   * You need to make sure that the `address` and `domain` field point to your
     homeserver.
   * You will also need to add your user ID to the `bridge` section.
3. Generate the appservice registration file by running `./mautrix-imessage -g`.
   * You can use the `-c` and `-r` flags to change the location of the config
     and registration files. They default to `config.yaml` and
     `registration.yaml` respectively.
4. Set up [mautrix-wsproxy](https://github.com/mautrix/wsproxy).
5. Update your registration file so the `url` field points to wsproxy (e.g.
   `http://localhost:29331`, this is where your homeserver reaches wsproxy),
   and make sure the `websocket_proxy` field in the bridge config also points
   to wsproxy (e.g. `ws://matrix.example.com:29331`, where the bridge reaches
   wsproxy).
6. Register the bridge on your homeserver (see [Registering appservices]).
7. Run the bridge with `./mautrix-imessage`.
8. If/when the bridge fails to initialize the iMessage connector with the
   `operation not permitted` error, go to System Preferences -> Security &
   Privacy -> Privacy -> Full Disk Access and grant access to the terminal
   you're running the bridge in.

[Registering appservices]: ../../../general/registering-appservices.md
