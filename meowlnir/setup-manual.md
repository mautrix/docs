# Setup

## Requirements
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/element-hq/synapse)).
  You need access to register an appservice, which usually involves editing the
  homeserver config file.

If you want to compile Meowlnir manually (which is not required), you'll also need:

* Go 1.26+ (download & installation instructions at <https://go.dev/doc/install>).

## Installation
You may either compile Meowlnir manually or download a prebuilt executable from
the mau.dev CI or [GitHub releases](https://github.com/maunium/meowlnir/releases).
Prebuilt executables are the simplest option, as they don't require having Go
installed.

### Option 1: Downloading a prebuilt executable from CI
1. Download the relevant artifacts:
   * linux/amd64: <https://mau.dev/maunium/meowlnir/-/jobs/artifacts/main/download?job=build%20amd64>
   * linux/arm64: <https://mau.dev/maunium/meowlnir/-/jobs/artifacts/main/download?job=build%20arm64>
   * linux/arm: <https://mau.dev/maunium/meowlnir/-/jobs/artifacts/main/download?job=build%20arm>
   * or find it yourself on <https://mau.dev/maunium/meowlnir/-/pipelines>
2. Extract the downloaded zip file into a new directory.

### Option 2: Downloading a release
1. Go to <https://github.com/maunium/meowlnir/releases>
2. Download the binary for the architecture you want and save it in a new
   directory.

### Option 3: Compiling manually
1. Clone the repo with `git clone https://github.com/maunium/meowlnir.git`
2. Enter the directory (`cd meowlnir`)
3. Run `./build.sh` to fetch Go dependencies and compile
   ([`build.sh`] will simply call `go build` with some additional flags).

[`build.sh`]: https://github.com/maunium/meowlnir/blob/main/build.sh

## Configuring and running
1. Follow the [configuration instructions](./config.md) to create a config file
   and registration.
2. Register the registration file with your homeserver
   (see [Registering appservices] in the bridge docs for details).
3. Run Meowlnir with `./meowlnir`.
4. Follow the instructions on the [Creating bots](./bot-create.md) page to
   actually initialize your bot, then the [Configuring bots](./bot-config.md)
   page to tell the bot what to do.

[Registering appservices]: https://docs.mau.fi/bridges/general/registering-appservices.html

## Updating
If you compiled manually, pull changes with `git pull` and recompile with
`./build.sh`.

If you downloaded a prebuilt executable, simply download a new one and replace
the old one.

Finally, start Meowlnir again.
