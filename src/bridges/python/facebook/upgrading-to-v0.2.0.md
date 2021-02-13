# Upgrading to v0.2.0
**The new version is on master, but is not in a tagged release yet**

Version 0.2.0 of the bridge includes some major breaking changes:

* It uses a completely different Messenger API, which means that all users will
  have to log in again to keep using the bridge. Logging in happens using email
  and password instead of stealing cookies like before. The bridge might include
  a web-based login interface that encrypts your password in-browser to prevent
  the bridge from seeing it.
* There are database schema changes that can not be reversed. Taking a backup
  before upgrading is recommended. Additionally, only PostgreSQL is supported,
  see below for SQLite migration instructions.

## SQLite migration
If you're using SQLite and want to keep your existing portal rooms, you must
migrate the database to Postgres first. If you don't care about keeping existing
portal rooms, you can use `clean-rooms` for cleaning up old portals and enable
backfilling in the config to get message history in the new portals.

The bridge includes a simple script similar to mautrix-telegram's [DBMS migration](../telegram/dbms-migration.md):

```bash
$ python -m mautrix_facebook.db.legacy_migrate -f <source db> -t <target db>
```

Both `<source db>` and `<target db>` are full database URLs,
e.g. `sqlite:///mautrix-facebook.db`
and `postgres://user:password@localhost/mautrixfacebook`

Steps:

0. Stop the bridge and update to v0.2.0
1. Update the database URI in the config
2. Initialize the new database with `alembic upgrade head`
3. Run the database migration script
4. Start the bridge again
