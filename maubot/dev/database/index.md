# Database
Plugins can request an instance-specific SQL database.

Maubot supports two types of databases: SQLAlchemy (legacy) and
asyncpg/aiosqlite (new). The SQLAlchemy mode is deprecated and not documented.

Note that the new asyncpg system requires maubot 0.3.0 or higher.

## Quick start
Update `maubot.yaml` to tell the server that your plugin wants a database:

```yaml
database: true
database_type: asyncpg
```

The database connector will be provided in the `database` property. The type is
`mautrix.util.async_db.Database`, which emulates asyncpg's pool interface.
For legacy plugins (with `database_type` unset or set to `sqlalchemy`), the
`database` property contains an SQLAlchemy engine.

For details on the methods available in the `Database` class,
see [Database API reference](./api-reference.md).

You can also find an example plugin in the maubot repo:
[examples/database/](https://github.com/maubot/maubot/tree/master/examples/database)

## Schema upgrades
mautrix-python includes a simple framework for versioning the schema.
The migrations are simply Python functions which are registered in an
`UpgradeTable`. By default, the migrations are registered in order and each one
bumps the version by 1. The example below would result in the `version` table
containing `2`.

```python
from mautrix.util.async_db import UpgradeTable, Scheme

upgrade_table = UpgradeTable()

@upgrade_table.register(description="Initial revision")
async def upgrade_v1(conn: Connection, scheme: Scheme) -> None:
    if scheme == Scheme.SQLITE:
        await conn.execute(
            """CREATE TABLE foo (
                test INTEGER PRIMARY KEY
            )"""
        )
    else:
        await conn.execute(
            """CREATE TABLE foo (
                test INTEGER GENERATED ALWAYS AS IDENTITY
            )"""
        )

@upgrade_table.register(description="Add text column")
async def upgrade_v2(conn: Connection) -> None:
    await conn.execute("ALTER TABLE foo ADD COLUMN text TEXT DEFAULT 'hi'")
```

After you have an `UpgradeTable`, you need to expose it from your plugin class
so maubot knows to use it:

```python
from mautrix.util.async_db import UpgradeTable
from maubot import Plugin

from .migrations import upgrade_table

class DatabasefulBot(Plugin):
    @classmethod
    def get_db_upgrade_table(cls) -> UpgradeTable:
        return upgrade_table
```

Maubot will then run the migrations always before starting your bot.
