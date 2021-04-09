# DBMS migration
_New in version 0.3.0_

The bridge includes a simple script for migrating between database management
systems. It simply reads the data from one database and inserts it into another
database.

The  script is located in [mautrix_telegram/scripts/dbms_migrate](https://github.com/tulir/mautrix-telegram/tree/master/mautrix_telegram/scripts/dbms_migrate).
It can be ran using
```bash
$ python3 -m mautrix_telegram.scripts.dbms_migrate -f <source db> -t <target db>
```

Both `<source db>` and `<target db>` are full database URLs,
e.g. `sqlite:///mautrix-telegram.db`
and `postgres://user:password@localhost/mautrixtelegram`

Steps:

0. Stop the bridge
1. Update the database URI in the config
2. Initialize the new database with `alembic upgrade head`
   * Inside Docker, you need to be in `/opt/mautrix-telegram/` and you need to
     pass the path to the config with `alembic -x config=/data/config.yaml upgrade head`
3. Run the database migration script
4. Start the bridge again
