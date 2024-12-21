# Go bridge setup

{{ #include ../selector.html }}

This page contains instructions for setting up the bridge by running the
executable yourself. You may also want to look at the other ways to run
the bridge:

* [Docker](../general/docker-setup.md)
* <span class="bridge-filter" bridges="whatsapp"></span> YunoHost:
  <a href="https://github.com/YunoHost-Apps/mautrix_whatsapp_ynh">mautrix_whatsapp_ynh<span class="bridge-filter" bridges="whatsapp"></span></a>
* [systemd service](#systemd-service) (at the bottom of this page)

Please note that everything in these docs are meant for server admins who want
to self-host the bridge. If you're just looking to use the bridges, check out
[Beeper], which provides fully managed instances of all of these bridges.

[Beeper]: https://www.beeper.com/

If you need help with setting up the bridge, you can ask in the Matrix room:
[#$bridge:maunium.net](https://matrix.to/#/#$bridge:maunium.net). For help with
setting up other parts like the homeserver that aren't the bridge, refer to
their documentation to find support rooms.

## Step 0: Requirements
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/matrix-org/synapse)).
  You need access to register an appservice, which usually involves editing the homeserver config file.
* A PostgreSQL server, v10 or higher (which you should already have for Synapse).
  * Make sure you don't share databases between unrelated programs.
    Shared postgres instance is fine, but shared database is not.
* <span class="bridge-filter" bridges="whatsapp">**mautrix-whatsapp**: </span>
  A WhatsApp client running on a phone (both physical and virtual phones work).
* <span class="bridge-filter" bridges="signal">**mautrix-signal**: </span>
  A Signal client that can add linked devices (both official mobile apps and
  some unofficial clients like signal-cli work).
* <span class="bridge-filter" bridges="signal">**mautrix-signal**: </span>
  ffmpeg (if you want to send/receive voice messages).
* <span class="bridge-filter" bridges="whatsapp">**mautrix-whatsapp**: </span>
  ffmpeg (if you want to send gifs from Matrix).
* <span class="bridge-filter" bridges="discord">**mautrix-discord**: </span>
  [LottieConverter](https://github.com/sot-tech/LottieConverter) if you want
  to receive animated stickers.
* <span class="bridge-filter" bridges="gvoice">**mautrix-gvoice**: </span>
  electron with an attached display in order to send messages to rooms from matrix (physical or virtual displays work).

If you want to compile the bridge manually (which is not required), you'll also need:

* Go 1.22+ (download & installation instructions at <https://go.dev/doc/install>).
* libolm3 with dev headers and a C/C++ compiler (if you want end-to-bridge encryption).
* <span class="bridge-filter" bridges="signal">**mautrix-signal**: </span>
  Rust, Cargo, libclang-dev and protoc (if you want to compile libsignal yourself).

## Step 1: Installation
You may either compile the bridge manually or download a prebuilt executable
from the mau.dev CI or [GitHub releases](https://github.com/mautrix/$bridge/releases).
Prebuilt executables are the simplest option, as they don't require having Go
nor libolm installed.

### Option 1: Downloading a prebuilt executable from CI
1. Download the relevant artifacts:
   * linux/amd64: <https://mau.dev/mautrix/$bridge/-/jobs/artifacts/$main_branch/download?job=build%20amd64>
   * linux/arm64: <https://mau.dev/mautrix/$bridge/-/jobs/artifacts/$main_branch/download?job=build%20arm64>
   * linux/arm: <https://mau.dev/mautrix/$bridge/-/jobs/artifacts/$main_branch/download?job=build%20arm>
     <span class="bridge-filter" bridges="all,!signal"></span>
   * or find it yourself on <https://mau.dev/mautrix/$bridge/-/pipelines>
2. Extract the downloaded zip file into a new directory.

### Option 2: Downloading a release
1. Go to <https://github.com/mautrix/$bridge/releases>
2. Download the binary for the architecture you want and save it in a new
   directory.

### Option 3: Compiling manually
1. Clone the repo with `git clone https://github.com/mautrix/$bridge.git mautrix-$bridge`
2. Enter the directory (`cd mautrix-$bridge`)
3. Run `./build.sh` to fetch Go dependencies and compile
   ([`build.sh`] will simply call `go build` with some additional flags).
   * If you want end-to-bridge encryption, make sure you have a C/C++ compiler
     and the Olm dev headers (`libolm-dev` on debian-based distros) installed.
   * If not, use `./build.sh -tags nocrypto` to disable encryption.
     * Note: signal's build.sh script doesn't support extra arguments yet,
       so you have to use build-go.sh manually after building libsignal-ffi.a.
   * As an experimental feature, you can also use `-tags goolm` to use a pure
     Go reimplementation of libolm. Encryption can be supported without a C
     compiler or Olm dev headers with this method.

<div class="bridge-filter" bridges="signal">

  For mautrix-signal, if you don't want to compile libsignal yourself, you can
  download a precompiled `libsignal_ffi.a` from the mau.dev CI and place it in
  `/usr/local/lib` (or some other directory set in `LIBRARY_PATH`). Download links:
  [Linux amd64](https://mau.dev/tulir/gomuks-build-docker/-/jobs/artifacts/master/raw/libsignal_ffi.a?job=libsignal%20linux%20amd64),
  [Linux arm64](https://mau.dev/tulir/gomuks-build-docker/-/jobs/artifacts/master/raw/libsignal_ffi.a?job=libsignal%20linux%20arm64),
  [macOS arm64](https://mau.dev/tulir/gomuks-build-docker/-/jobs/artifacts/master/raw/libsignal_ffi.a?job=libsignal%20macos%20arm64)

</div>

[`build.sh`]: https://github.com/mautrix/$bridge/blob/main/build.sh

## Step 2: Configuring and running
1. Copy `example-config.yaml` to `config.yaml`.
   For v2 bridges using the megabridge architecture, use `./mautrix-$bridge -e`
   to generate the example config and save it to `config.yaml`.
2. Update the config to your liking. See the [initial bridge config](../general/initial-config.md)
   page for recommendations.
3. Generate the appservice registration file by running `./mautrix-$bridge -g`.
   * You can use the `-c` and `-r` flags to change the location of the config
     and registration files. They default to `config.yaml` and
     `registration.yaml` respectively.
4. Register the bridge on your homeserver (see [Registering appservices]).
5. Run the bridge with `./mautrix-$bridge`.

[Registering appservices]: ../general/registering-appservices.md

## Updating
If you compiled manually, pull changes with `git pull` and recompile with
`./build.sh`.

If you downloaded a prebuilt executable, simply download a new one and replace
the old one.

Finally, start the bridge again.

## systemd service
1. Create a user for the bridge:
   ```shell
   $ sudo adduser --system mautrix-$bridge --home /opt/mautrix-$bridge
   ```
2. Follow the normal setup instructions above.
   Make sure you use that user and home directory for the bridge.
4. Create a systemd service file at `/etc/systemd/system/mautrix-$bridge.service`:
   ```ini
   [Unit]
   Description=mautrix-$bridge bridge
   
   [Service]
   Type=exec
   User=mautrix-$bridge
   WorkingDirectory=/opt/mautrix-$bridge
   ExecStart=/opt/mautrix-$bridge/mautrix-$bridge
   Restart=on-failure
   RestartSec=30s
   
   # Optional hardening to improve security
   ReadWritePaths=/opt/mautrix-$bridge
   NoNewPrivileges=yes
   # This may cause issues with libsignal.
   # Should be safe for other bridges
   #MemoryDenyWriteExecute=true
   PrivateDevices=yes
   PrivateTmp=yes
   ProtectHome=yes
   ProtectSystem=strict
   ProtectControlGroups=true
   RestrictSUIDSGID=true
   RestrictRealtime=true
   LockPersonality=true
   ProtectKernelLogs=true
   ProtectKernelTunables=true
   ProtectHostname=true
   ProtectKernelModules=true
   PrivateUsers=true
   ProtectClock=true
   SystemCallArchitectures=native
   SystemCallErrorNumber=EPERM
   SystemCallFilter=@system-service
   
   [Install]
   WantedBy=multi-user.target
   ```
