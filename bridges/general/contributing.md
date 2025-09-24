# Contributing guidelines

## Development instructions
The latest version of Go is recommended for developing Go bridges, but using
the previous version is fine too. Go only supports the last two releases, so
anything older than that is [EOL](https://endoflife.date/go) and will not work.

Since the bridges use cgo, you'll also need a C compiler and libolm-dev installed.
For Signal, you can either install Rust, or just download `libsignal_ffi.a`
from the CI to avoid the Rust dependency (see [normal Signal setup instructions]
for that).

[normal Signal setup instructions]: https://docs.mau.fi/bridges/go/setup.html?bridge=signal#option-3-compiling-manually

You should install [pre-commit] and run `pre-commit install` in the repo before
committing to have linters run automatically. You can also run `pre-commit run -a`
before pushing to lint everything. Finally, you can let GitHub actions run the
linters for you after pushing, but it's usually more effort to go back and fix
things at that point.

[pre-commit]: https://pre-commit.com/

Using Linux or macOS is recommended for development. Windows is generally not a
supported environment for anything, so WSL is likely necessary if you're
running Windows.

A local Synapse instance is useful for testing bridges. Alternatively, you can
sign up for [Beeper] and use [bridge-manager] to run local bridges against the
Beeper servers (there's a convenient `--local-dev` flag for `bbctl run`).

[Beeper]: https://beeper.com
[bridge-manager]: https://github.com/beeper/bridge-manager

## Code style
See <https://beeper.notion.site/Beeper-Go-Guidelines-ae943532d96f4ad6a614baf836c073eb>

## Making pull requests
Updating the changelog file is not necessary when making a pull request. That
will be done separately when a release is being made.

For any non-trivial changes, you should join the Matrix room linked in the
project readme and briefly explain your plan to confirm that it makes sense
and is wanted. The Matrix room is also preferred in case discussion about the
contribution beyond basic code review is necessary.

Pull requests may be missed and/or forgotten for extended periods of time,
especially if they involve more complicated changes. Feel free to remind us in
the appropriate Matrix room if it seems like nothing is happening. Pinging on
GitHub is **not** recommended.
