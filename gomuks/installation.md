# Installation

## Installing a package

The releases on GitHub contain binaries and debian
packages: <https://github.com/tulir/gomuks/releases>

GitLab CI builds binaries for each
commit: <https://mau.dev/tulir/gomuks/pipelines> (currently available for
linux/amd64, linux/arm, linux/arm64, darwin/amd64, darwin/arm64 and
windows/amd64).

The release and CI binaries for Linux and Windows are statically built and have
no dependencies at all. The binaries for macOS require installing libolm, either
with `brew install libolm` or by placing `libolm.3.dylib` from the CI in the
same directory as the `gomuks` binary.

There are also community maintained packages for several distributions. If
you've made a new distro package, please add it to the list below.

* Arch Linux (AUR): [gomuks](https://aur.archlinux.org/packages/gomuks),
  [gomuks-bin](https://aur.archlinux.org/packages/gomuks-bin/), and
  [gomuks-git](https://aur.archlinux.org/packages/gomuks-git)
* NixOS: [gomuks](https://github.com/NixOS/nixpkgs/blob/master/pkgs/applications/networking/instant-messengers/gomuks/default.nix)
* OpenSUSE (OBS): [home:albino:matrix/gomuks](https://build.opensuse.org/package/show/home:albino:matrix/gomuks)
* Alpine Linux: [gomuks](https://pkgs.alpinelinux.org/packages?name=gomuks)
* macOS (Homebrew Tap): [aaronraimist/tap/gomuks](https://github.com/aaronraimist/homebrew-tap)
* Windows (scoop): [gomuks](https://github.com/TheLastZombie/scoop-bucket/blob/master/bucket/gomuks.json)

## Compiling from source

0. Install [Go](https://golang.org/) 1.13 or higher.
   * If you want end-to-end encryption, also install `libolm-dev`
     (3.x required, 2.x won't work) and C/C++ compilers.
   * If you don't want encryption, disable CGO with `export CGO_ENABLED=0`.
1. Clone the repo: `git clone https://github.com/tulir/gomuks.git && cd gomuks`
2. Build: `go build` (alternatively, use `go install` to build to `$GOPATH/bin`
   instead of the current directory)

Simply pull changes (`git pull`) and run `go build` again to update.
