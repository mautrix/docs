# WhatsApp bridge setup
## Requirements
### Compilation (optional)
* Go 1.13+ (download & installation instructions at <https://golang.org/dl/>)
* Olm dev headers and a C/C++ compiler (if you want end-to-bridge encryption)

### Runtime
* A Matrix homeserver that supports application services
  (e.g. [Synapse](https://github.com/matrix-org/synapse))
* A WhatsApp client running on a phone or in an emulated Android VM.
* libolm3 (if you compiled manually and want end-to-bridge encryption)
* ffmpeg (if you want to send gifs from Matrix)

## Installation
You may either compile the bridge manually or download a prebuilt executable
from the mau.dev CI.

### Compiling manually
1. Clone the repo with `git clone https://github.com/tulir/mautrix-whatsapp.git`
2. Enter the directory (`cd mautrix-whatsapp`)
3. Run `./build.sh` to fetch Go dependencies and compile
   ([`build.sh`] will simply call `go build` with some additional flags).
   * If you want end-to-bridge encryption, make sure you have a C/C++ compiler
     and the Olm dev headers (`libolm-dev` on debian-based distros) installed.
     Note that libolm3 is required, which means you have to use backports on
     Debian stable.
   * If not, use `./build.sh -tags nocrypto` to disable encryption.

[`build.sh`]: https://github.com/tulir/mautrix-whatsapp/blob/master/build.sh

### Downloading a prebuilt executable
1. Go to https://mau.dev/tulir/mautrix-whatsapp/pipelines?scope=branches&page=1
2. Find the entry for the `master` branch and click the download button on the
   right-hand side in the list.
   * The builds are all static with olm included, but SQLite may not work.
     Postgres is recommended anyway.
3. Extract the downloaded zip file into a new directory.

## Configuring and running
1. Copy `example-config.yaml` to `config.yaml`
2. Update the config to your liking.
   * You need to make sure that the `address` and `domain` field point to your
     homeserver.
   * You will also need to add your user of admin user under the `permissions`
     section.
3. Generate the appservice registration file by running `./mautrix-whatsapp -g`.
   * You can use the `-c` and `-r` flags to change the location of the config
     and registration files. They default to `config.yaml` and
     `registration.yaml` respectively.
4. Add the path to the registration file (`registration.yaml` by default) to
   your synapse `homeserver.yaml` under `app_service_config_files`. You will
   then need to restart the synapse server. Remember to restart it every time
   the registration file is regenerated.
5. Run the bridge with `./mautrix-whatsapp`.

## Updating
If you compiled manually, pull changes with `git pull` and recompile with
`go build`.

If you downloaded a prebuilt executable, simply download a new one and replace
the old one.

Finally, start the bridge again.
