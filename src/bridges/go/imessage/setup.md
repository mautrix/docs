# Bridge setup
## Requirements
### Compilation (optional)
* Go 1.13+ (download & installation instructions at https://golang.org/dl/)
* libolm3 with dev headers (`brew install libolm`)

### Runtime
* A computer running a reasonably new version of macOS.
* A Matrix homeserver that supports application services
  (e.g. [Synapse](https://github.com/matrix-org/synapse)).
* A [websocket proxy](https://github.com/tulir/mautrix-wsproxy) to receive
  appservice transactions.

## Installation
You may either compile the bridge manually or download a prebuilt executable
from the mau.dev CI.

### Compiling manually
1. Clone the repo with `git clone https://github.com/tulir/mautrix-imessage.git`.
2. Enter the directory (`cd mautrix-imessage`).
3. Run `./build.sh` to fetch Go dependencies and compile
   ([`build.sh`](https://github.com/tulir/mautrix-imessage/blob/master/build.sh)
   will simply call `go build` with some additional flags).

### Downloading a prebuilt executable
1. Go to https://mau.dev/tulir/mautrix-imessage/pipelines?scope=branches&page=1
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
4. Set up [mautrix-wsproxy](https://github.com/tulir/mautrix-wsproxy) and update
   the generated registration file to point to it. Also update the
   `websocket_proxy` field in the bridge config if you didn't do that already.
5. Add the path to the registration file (`registration.yaml` by default) to
   your synapse `homeserver.yaml` under `app_service_config_files`. You will
   then need to restart the synapse server. Remember to restart it every time
   the registration file is regenerated.
6. Run the bridge with `./mautrix-imessage`.
