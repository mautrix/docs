# iMessage-NoSip bridge setup (macOS-No-Sip)
Please note that everything in these docs are meant for server admins who want
to self-host the bridge. If you're just looking to use the bridges, check out
[Beeper], which provides fully managed instances of all of these bridges.

[Beeper]: https://www.beeper.com/

## Requirements
### Compilation (optional)
* Go 1.14+ (download & installation instructions at <https://golang.org/dl/>)
* libolm3 with dev headers (`brew install libolm`)

### Runtime
* A computer running a reasonably new version of macOS.
  * The bridge requires full disk access in privacy settings to read your chat
    database.
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/matrix-org/synapse)).
  You need access to register an appservice, which usually involves editing the homeserver config file.
* A [websocket proxy](https://github.com/mautrix/wsproxy) to receive
  appservice transactions.

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
1. Go to https://mau.dev/mautrix/imessage/pipelines?scope=branches&page=1
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
   `http://localhost:29331`), and make sure the `websocket_proxy` field in the
   bridge config also points to wsproxy (e.g. `ws://matrix.example.com:29331`).
6. Add the path to the registration file (`registration.yaml` by default) to
   your synapse `homeserver.yaml` under `app_service_config_files`. You will
   then need to restart the synapse server. Remember to restart it every time
   the registration file is regenerated.
7. Boot into recovery and open terminal and run `csrutil disable`
8. Open the config.plist (in EFI/OC/config.plist) and change the Key boot-args to add  `amfi_get_out_of_my_way=0x1` example:
```
<key>boot-args</key>
     <string>-v keepsyms=1 tlbto_us=0 vti=9 amfi_get_out_of_my_way=0x1</string>
```
9. Install [com.apple.security.xpc.plist](https://github.com/open-imcore/barcelona/blob/mautrix/com.apple.security.xpc.plist) to `/Library/Preferences/com.apple.security.xpc.plist`
10. get the barcelona exec from [https://jank.crap.studio/job/barcelona/job/mautrix//](https://jank.crap.studio/job/barcelona/job/mautrix/), get `darwin-barcelona-mautrix`	and download it to your computer
11. Change `imessage_rest_path` to barcelona exec path from previous step
    example `imessage_rest_path = /Users/user/Documents/Project/Imessage/darwin-barcelona-mautrix`
12. Change `platform: mac` to `platform: mac-nosip`
13. Run the bridge with `./mautrix-imessage`.
14. If/when the bridge fails to initialize the iMessage connector with the
   `operation not permitted` error, go to System Preferences -> Security &
   Privacy -> Privacy -> Full Disk Access and grant access to the terminal
   you're running the bridge in.
