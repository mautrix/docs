# iMessage bridge setup (macOS without SIP)
Please note that everything in these docs are meant for server admins who want
to self-host the bridge. If you're just looking to use the bridges, check out
[Beeper], which provides fully managed instances of all of these bridges.

[Beeper]: https://www.beeper.com/

## Requirements
* A computer running a reasonably new version of macOS, with SIP and AMFI
  disabled (see instructions below).
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/matrix-org/synapse)).
  You need access to register an appservice, which usually involves editing the homeserver config file.
* A [websocket proxy](https://github.com/mautrix/wsproxy) to receive appservice transactions.

If you want to compile the bridge manually (which is not required), you'll also need:

* Go 1.17+ (download & installation instructions at <https://go.dev/doc/install>).
* libolm3 with dev headers (`brew install libolm`).
* Optionally libheif with dev headers for heif -> jpeg conversion (`brew install libheif`).
* Xcode 12.4+ if you want to build Barcelona yourself.

## Installation
This form of the bridge consists of two components: [Barcelona] for connecting
to iMessage and mautrix-imessage for connecting to Matrix. mautrix-imessage
will run Barcelona as a subprocess and they communicate over stdio.

You may either compile the bridge and Barcelona manually, or download prebuilt
executables from the mau.dev CI and GitHub actions respectively.

Because Barcelona hooks into Apple's private APIs, you must disable SIP (System
Integrity Protection) and AMFI (Apple Mobile File Integrity) on the Mac for it
to work. Disabling SIP will make your Mac less secure, so you should only do it
on a Mac that you won't use for anything else.

[Barcelona]: https://github.com/beeper/barcelona

### Compiling manually
1. Clone the repo with `git clone https://github.com/mautrix/imessage.git`.
2. Enter the directory (`cd mautrix-imessage`).
3. Run `./build.sh` to fetch Go dependencies and compile
   ([`build.sh`](https://github.com/mautrix/imessage/blob/master/build.sh)
   will simply call `go build` with some additional flags).
4. Refer to the [Barcelona build instructions] for building Barcelona.

[Barcelona build instructions]: https://github.com/beeper/barcelona/blob/mautrix/BUILDING.md

### Downloading prebuilt executables
1. Go to <https://mau.dev/mautrix/imessage/pipelines?scope=branches&page=1>
2. Find the entry for the `master` branch and click the download button on the
   right-hand side in the list and choose "build universal".
3. Extract the downloaded zip file into a new directory.
4. Download `darwin-barcelona-mautrix` from <https://github.com/beeper/barcelona/actions>
   ([latest direct download](https://nightly.link/beeper/barcelona/workflows/build/main/darwin-barcelona-mautrix.zip)).

### Disabling SIP and AMFI
**Disabling SIP and AMFI will make your Mac significantly less secure.**

1. Boot into recovery mode (hold Command+R while booting) and open a terminal
2. Run `csrutil disable` to disable SIP
3. Run `nvram boot-args="amfi_get_out_of_my_way=0x1 ipc_control_port_options=0"` to disable AMFI while ensuring that the rest of your system continues to work correctly

If you are running macOS in a VM (e.g. through [OSX-KVM]) you may need to
disable AMFI with a boot option. Assuming you are using OSX-KVM and OpenCore,
open the `config.plist` (in `EFI/OC/config.plist`) and change the key
`boot-args` to add `amfi_get_out_of_my_way=0x1` and `ipc_control_port_options=0` example:

```
<key>boot-args</key>
<string>-v keepsyms=1 tlbto_us=0 vti=9 amfi_get_out_of_my_way=0x1 ipc_control_port_options=0</string>
```

You can also refer to Apple's [official documentation on disabling SIP](https://developer.apple.com/documentation/security/disabling_and_enabling_system_integrity_protection).

[OSX-KVM]: https://github.com/kholia/OSX-KVM

## Configuring and running
1. Follow steps 1-6 from the [normal macOS setup](../mac/setup.md)
2. Install Barcelona's [com.apple.security.xpc.plist] to `/Library/Preferences/com.apple.security.xpc.plist`
3. In the `imessage` section of the config, change `platform` to `mac-nosip`
   and set `imessage_rest_path` to the path to the `darwin-barcelona-mautrix`
   executable you downloaded or compiled.
4. Run the bridge with `./mautrix-imessage`.

[com.apple.security.xpc.plist]: https://github.com/beeper/barcelona/blob/mautrix/com.apple.security.xpc.plist
