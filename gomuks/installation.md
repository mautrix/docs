# Installation

## Installing a package

The releases on GitHub contain binaries and debian
packages: <https://github.com/gomuks/gomuks/releases>

gomuks web doesn't have releases yet, only CI binaries are available.

GitLab CI builds binaries for each
commit: <https://mau.dev/gomuks/gomuks/-/pipelines> (currently available for
linux/amd64, linux/arm, linux/arm64, darwin/amd64, darwin/arm64).

The release and CI binaries for Linux are statically built and have no
hard dependencies. The binaries for macOS require installing libolm, either
with `brew install libolm` or by placing `libolm.3.dylib` from the CI in the
same directory as the `gomuks` binary.

gomuks web requires having `ffmpeg` and `ffprobe` in `$PATH` to generate
metadata when sending video files.

The Android wrapper does not currently come with the backend, which means you
have to run the backend elsewhere. Something like a Raspberry Pi plus Tailscale
(or another Wireguard solution) for external connectivity usually works nicely.

Direct links to latest CI binaries:

* gomuks legacy:
  [linux/amd64](https://mau.dev/gomuks/gomuks/-/jobs/artifacts/master/raw/gomuks?job=linux%2Famd64),
  [linux/arm64](https://mau.dev/gomuks/gomuks/-/jobs/artifacts/master/raw/gomuks?job=linux%2Farm64),
  [linux/arm](https://mau.dev/gomuks/gomuks/-/jobs/artifacts/master/raw/gomuks?job=linux%2Farm),
  [macos/arm64](https://mau.dev/gomuks/gomuks/-/jobs/artifacts/master/download?job=macos%2Farm64)
* gomuks web:
  [linux/amd64](https://mau.dev/gomuks/gomuks/-/jobs/artifacts/main/raw/gomuks?job=linux%2Famd64),
  [linux/arm64](https://mau.dev/gomuks/gomuks/-/jobs/artifacts/main/raw/gomuks?job=linux%2Farm64),
  [linux/arm](https://mau.dev/gomuks/gomuks/-/jobs/artifacts/main/raw/gomuks?job=linux%2Farm),
  [macos/arm64](https://mau.dev/gomuks/gomuks/-/jobs/artifacts/main/download?job=macos%2Farm64),
  [windows/amd64](https://mau.dev/gomuks/gomuks/-/jobs/artifacts/main/raw/gomuks.exe?job=windows%2Famd64)
* gomuks android:
  [arm64-v8a.apk](https://mau.dev/gomuks/android/-/jobs/artifacts/main/raw/gomuks-android-arm64-v8a.apk?job=build),
  [x86_64.apk](https://mau.dev/gomuks/android/-/jobs/artifacts/main/raw/gomuks-android-x86_64.apk?job=build)

There are also community maintained packages for several distributions (gomuks legacy only). If
you've made a new distro package, please add it to the list below.

* Arch Linux (AUR): [gomuks](https://aur.archlinux.org/packages/gomuks),
  [gomuks-bin](https://aur.archlinux.org/packages/gomuks-bin/), and
  [gomuks-git](https://aur.archlinux.org/packages/gomuks-git)
* NixOS: [gomuks](https://github.com/NixOS/nixpkgs/blob/master/pkgs/applications/networking/instant-messengers/gomuks/default.nix)
* OpenSUSE (OBS): [home:albino:matrix/gomuks](https://build.opensuse.org/package/show/home:albino:matrix/gomuks)
* Alpine Linux: [gomuks](https://pkgs.alpinelinux.org/packages?name=gomuks)
* Debian: [gomuks](https://tracker.debian.org/pkg/gomuks)
* macOS (Homebrew Tap): [aaronraimist/tap/gomuks](https://github.com/aaronraimist/homebrew-tap)
* macOS (MacPorts): [gomuks](https://ports.macports.org/port/gomuks)

## Compiling from source

0. Install [Go](https://go.dev/doc/install) 1.24 or higher.
   * Compiling the frontend for gomuks web also requires the latest LTS of
     Node.js or higher (currently v20).
   * `libolm-dev` must also be installed for end-to-end encryption.
1. Clone the repo: `git clone https://github.com/gomuks/gomuks.git && cd gomuks`
   * To get legacy gomuks terminal, run `git checkout master` after cd.
2. Build: `./build.sh`
   ([build.sh] will simply call go build with some additional flags).

[build.sh]: https://github.com/gomuks/gomuks/blob/main/build.sh
Simply pull changes (`git pull`) and run `./build.sh` again to update.

### Common compilation issues
* `fatal error: olm/olm.h: No such file or directory` means you forgot to install libolm-dev,
  or that you installed it in a weird place which isn't in your default library lookup path.
  * In the latter case, set the `LIBRARY_PATH` and `CPATH` environment variables,
    e.g. `export LIBRARY_PATH=/usr/local/lib CPATH=/usr/local/include`.
* `fatal error: olm/pk.h: No such file or directory` means you installed libolm2 instead of libolm3.
* `cgo: C compiler "gcc" not found: exec: "gcc": executable file not found in $PATH` means you forgot to install C/C++ compilers.
* `//go:build comment without // +build comment` means your Go version is slightly outdated.
* `cannot load embed: malformed module path "embed"` or `package embed is not in GOROOT` means your Go version is very outdated.
* `cannot find package "maunium.net/go/gomuks/..." in any of:` usually means your Go version is extremely outdated.

## Docker (gomuks web)
The backend for gomuks web can also run in Docker. Docker images are available
at `dock.mau.dev/gomuks/gomuks`.

Keep in mind that the backend has all your encryption keys, which means it must
be ran in a secure location.
