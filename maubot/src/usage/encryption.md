# Encryption
Maubot has basic support for end-to-end encryption, but it is not yet exposed
in the web management UI.

## Dependencies
To enable encryption, you must first have maubot installed with the `e2be`
optional dependency. To do this, you can either add `[e2be]` at the end of the
package in the `pip install` command, e.g. `pip install --upgrade maubot[e2be]`.
Alternatively, you can install the dependencies manually (`asyncpg`,
`python-olm`, `pycryptodome` and `unpaddedbase64`). The Docker image has all
optional dependencies installed by default.

It is strongly recommended to use Postgres for the crypto database, as the
pickle storage can get corrupted easily.

## Getting a fresh device ID
When using maubot with encryption, you must have an access token and a device ID
that haven't been used in an e2ee-capable client. In other words, you can't take
the access token from Element, you have to log in manually. The easiest way to
do that is to use [`mbc auth`](cli/auth.md).

## Updating the database
After installing dependencies, insert the device ID into the database while
maubot is turned off:

```sql
UPDATE client SET device_id='FOO123' WHERE id='@yourbot:example.com';
```

If you want to update the access token at the same time, you can use

```sql
UPDATE client SET device_id='FOO123', access_token='MDAx...' WHERE id='@yourbot:example.com';
```
