# Encryption

## Dependencies
To enable encryption, you must first have maubot installed with the `encryption`
optional dependency. To do this, you can either add `[encryption]` at the end
of the package in the `pip install` command, e.g. `pip install --upgrade maubot[encryption]`.
Alternatively, you can install the dependencies manually (`asyncpg`,
`python-olm`, `pycryptodome` and `unpaddedbase64`). The Docker image has all
optional dependencies installed by default.

## Getting a fresh device ID
When using maubot with encryption, you must have an access token and a device ID
that haven't been used in an e2ee-capable client. In other words, you can't take
the access token from Element, you have to log in manually. The easiest way to
do that is to use [`mbc auth`](cli/auth.md).

## Actually enabling encryption
After installing dependencies, put the device ID in the maubot client, either
using the web UI or just the `--update-client` flag with `mbc auth`.
