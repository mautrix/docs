# Plugin fields and lifecycle methods

The `Plugin` base class has various lifecycle methods and properties that may be
useful for plugins.

## Fields

* `client` - The mautrix client instance for the bot, can be used to make
  arbitrary API requests.
* `id` - The ID of the plugin instance.
* `log` - A logger for the plugin instance.
* `loop` - The asyncio event loop.
* `config` - If the config is enabled, the data from the config (see
  the [Configuration] page).
* `database` - If the database is enabled, the SQLAlchemy database engine (see
  the [Database] page).
* `webapp` - If the HTTP handlers are enabled, the aiohttp `UrlDispatcher` for
  the plugin (see the [HTTP handlers]) page.
* `webapp_url` - If the HTTP handlers are enabled, the public base URL where the
  endpoints are exposed.

[Configuration]: <> (./configuration.md)
[Database]: <> (./database.md)
[HTTP handlers]: ./handlers/web.md

## Methods

* `register_handler_class(object)` - Register another object where handlers are
  read from (see the [Handlers](./handlers/index.md) page).

## Lifecycle methods

* `async def start()` - Called when the plugin instance is starting.
* `async def stop()` - Called when the plugin instance is stopping.
* `async def pre_start()` - Called when the plugin instance is starting, before
  the handlers of the main class are registered.
* `async def pre_stop()` - Called when the plugin instance is stopping, before
  any handlers are unregistered.
* `def get_config_class() -> Type[Config]` - When the plugin has config, this
  must return the class used for parsing and updating the config.
* `def on_external_config_update()` - Called when the plugin instance's config
  is updated from the API. By default, this will
  call `self.config.load_and_update()`.
