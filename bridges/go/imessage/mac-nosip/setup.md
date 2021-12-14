# iMessage bridge setup (macOS without SIP)
Please note that everything in these docs are meant for server admins who want
to self-host the bridge. If you're just looking to use the bridges, check out
[Beeper], which provides fully managed instances of all of these bridges.

[Beeper]: https://www.beeper.com/

## Requirements
### Compilation (optional)
* Go 1.16+ (download & installation instructions at <https://golang.org/dl/>)
* libolm3 with dev headers (`brew install libolm`)
* Xcode 12.4+ if you want to build Barcelona yourself

### Runtime
* A computer running a reasonably new version of macOS, with SIP and AMFI
  disabled (instructions below).
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/matrix-org/synapse)).
  You need access to register an appservice, which usually involves editing the homeserver config file.
* A [websocket proxy](https://github.com/mautrix/wsproxy) to receive
  appservice transactions.

### Disabling SIP and AMFI
**Disabling SIP and AMFI *will* make your Mac less secure.** You should only
use this method of bridging if you have a Mac dedicated for it (where you don't
run any untrusted software).

1. Boot into recovery mode (hold Command+R while booting) and open a terminal
2. Run `csrutil disable` to disable SIP
3. Run `nvram boot-args="amfi_get_out_of_my_way=0x1"` to disable AMFI

If you are running macOS in a VM (e.g. through [OSX-KVM]) you may need to
disable AMFI with a boot option. Assuming you are using OSX-KVM and OpenCore,
open the `config.plist` (in `EFI/OC/config.plist`) and change the key
`boot-args` to add `amfi_get_out_of_my_way=0x1` example:

```
<key>boot-args</key>
<string>-v keepsyms=1 tlbto_us=0 vti=9 amfi_get_out_of_my_way=0x1</string>
```

[OSX-KVM]: https://github.com/kholia/OSX-KVM

## Installation
You may either compile the bridge manually or download a prebuilt executable
from the mau.dev CI.

### Compiling manually
1. Clone the repo with `git clone https://github.com/mautrix/imessage.git`.
2. Enter the directory (`cd mautrix-imessage`).
3. Run `./build.sh` to fetch Go dependencies and compile
   ([`build.sh`](https://github.com/mautrix/imessage/blob/master/build.sh)
   will simply call `go build` with some additional flags).
4. Refer to the [Barcelona build instructions] for building that.

[Barcelona build instructions]: https://github.com/open-imcore/barcelona/blob/mautrix/BUILDING.md

### Downloading a prebuilt executable
1. Go to <https://mau.dev/mautrix/imessage/pipelines?scope=branches&page=1>
2. Find the entry for the `master` branch and click the download button on the
   right-hand side in the list and choose "build universal".
3. Extract the downloaded zip file into a new directory.
4. Download `darwin-barcelona-mautrix` from <https://jank.crap.studio/job/barcelona/job/mautrix/>.

## Configuring and running
1. Follow steps 1-6 from the [normal macOS setup](../mac/setup.md)
2. Install Barcelona's [com.apple.security.xpc.plist] to `/Library/Preferences/com.apple.security.xpc.plist`
3. In the `imessage` section of the config, change `platform` to `mac-nosip`
   and set `imessage_rest_path` to the path to the `darwin-barcelona-mautrix`
   executable you downloaded or compiled.
4. Run the bridge with `./mautrix-imessage`.

[com.apple.security.xpc.plist]: https://github.com/open-imcore/barcelona/blob/mautrix/com.apple.security.xpc.plist
