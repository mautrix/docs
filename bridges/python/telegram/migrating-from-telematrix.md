# Migrating from Telematrix
_New in version 0.3.0_

***Removed in version 0.11.0***

When migrating from Telematrix, you'll need to configure mautrix-telegram to use
the same user ID format and bridge bot username. Other options, such as the AS
token, port, etc.. don't need to be the same.

The database migration script is located in [mautrix_telegram/scripts/telematrix_import](https://github.com/mautrix/telegram/tree/master/mautrix_telegram/scripts/telematrix_import). It can be ran using
```bash
$ python -m mautrix_telegram.scripts.telematrix_import [arguments...]
```

The script has three arguments:
* `-b` / `--bot-id` (required) - The internal numeric user ID of the relay bot.
  This can be fetched from `https://api.telegram.org/bot<BOT TOKEN>/getMe`
* `-c` / `--config` - The path to the mautrix-telegram config. Used for the
  database path and might be used for other values in the future
  (e.g. auto-fetching the bot id). Defaults to `config.yaml`.
* `-t` / `--telematrix-database` - The URL of the telematrix database.
  Defaults to sqlite `database.db`
