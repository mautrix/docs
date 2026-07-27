# C FFI
In addition to the HTTP and Go interfaces, the gomuks backend can be used
through C function calls. The interface is mostly documented in the header file:
<https://github.com/gomuks/gomuks/blob/main/pkg/ffi/gomuksffi.h>.

The C functions are just light wrapping to access the [RPC API](https://spec.mau.fi/gomuks/rpc.html),
so almost everything happens through the `GomuksSubmitCommand` function and the
event callback passed to `GomuksStart`. There are some extra methods which can
optionally be used for more advanced media features (like upload progress and
download streaming).

## Building
The easiest way to build the `.so` file is to use `./pkg/ffi/build.sh` in the
gomuks repo, which ends up calling `go build` with a bunch of flags.

If you want to cross-compile using the build script, use `TARGET_GOOS` and
`TARGET_GOARCH` instead of `GOOS` and `GOARCH` respectively. Trying to set the
plain variables will make `go tool` compile maubuild for the target instead of
the host and then fail to execute it.

Additional build tags (like goolm) can be set in the `GO_BUILD_TAGS` environment
variable. If you want a static archive (`.a`) instead of a dynamic library, set
`MAU_STATIC_BUILD=true` in environment.

### Building manually
You can also ignore the helper script and call `go build` manually.
The details to note when doing that are:

* The main package is `./pkg/ffi`.
* `-buildmode=c-shared` makes dynamic libraries and `-buildmode=c-archive`
  makes static ones. You also usually need `-linkmode external -extldflags '-static'`
  for static builds.
* `-tags sqlite_fts5` is mandatory for all gomuks builds.
* Building in version info is strongly recommended. It's done by setting some
  variables using the `-X` flag. Specifically, the `go.mau.fi/gomuks/version`
  package has `Commit` (full git commit hash), `BuildTime` (RFC3339 timestamp
  with second precision) and `Tag` (git tag only if building an exact tag).
  Additionally, `maunium.net/go/mautrix` has `GoModVersion` which is the raw
  version extracted from the go.mod file.
