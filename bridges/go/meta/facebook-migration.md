# Migrating from mautrix-facebook
**Migration from mautrix-facebook was removed in v0.4.0.**
v0.3.2 is the last version that can be used to migrate from mautrix-facebook.

0. Either create a new database for mautrix-meta, or rename the old one and
   create a new one with the original name.
1. Configure mautrix-meta normally. You must use the same bot username and
   username template to migrate old chats. You can also just reuse the same
   registration file, as long as you keep the same hostname/port and as/hs_token.
   * You can't use the same config file as mautrix-facebook, make a new one
     and copy the relevant values.
   * Don't start the bridge yet.
2. Run `./mautrix-meta --db-migrate-from postgres://user:pass@host/olddb`
   (or `--db-migrate-from /path/to/old.db` for SQLite).
3. Optionally, manually transfer the tables starting with `crypto_`
   (just `pg_dump` + import to new db for each table).
4. Run the bridge normally.

mautrix-instagram can not be migrated, you just have to delete the rooms and
start with a fresh db. You can still reuse the username template if you want to.
