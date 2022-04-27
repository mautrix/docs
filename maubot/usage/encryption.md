# Encryption

## Dependencies
To enable encryption, you must first have maubot installed with the `encryption`
optional dependency. To do this, you can either add `[encryption]` at the end
of the package in the `pip install` command, e.g. `pip install --upgrade maubot[encryption]`.
Alternatively, you can install the dependencies manually (`python-olm`,
`pycryptodome` and `unpaddedbase64`). The Docker image has all optional
dependencies installed by default.

Note that installing `python-olm` requires libolm3 with dev headers, Python dev
headers, and a C compiler. This means `libolm-dev`, `python3-dev` and
`build-essential` on Debian 11+ and Ubuntu 19.10+.

If you want to avoid the dev headers, you can install the `libolm3` package
without -dev and get a pre-compiled python-olm from gitlab.matrix.org's PyPI
registry. However, this method has not been tested properly, so it might not
work at all.

```
pip install python-olm --extra-index-url https://gitlab.matrix.org/api/v4/projects/27/packages/pypi/simple
```

To install python-olm on macOS, you can use libolm from homebrew like this:
```
brew install libolm
pip3 install python-olm --global-option="build_ext" --global-option="--include-dirs=/opt/homebrew/opt/libolm/include" --global-option="--library-dirs=/opt/homebrew/opt/libolm/lib"git st
```

## Getting a fresh device ID
When using maubot with encryption, you must have an access token and a device ID
that haven't been used in an e2ee-capable client. In other words, you can't take
the access token from Element, you have to log in manually. The easiest way to
do that is to use [`mbc auth`](cli/auth.md).

## Actually enabling encryption
After installing dependencies, put the device ID in the maubot client, either
using the web UI or just the `--update-client` flag with `mbc auth`.
