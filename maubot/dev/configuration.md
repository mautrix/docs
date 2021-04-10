# Configuration

Plugins can have instance-specific YAML config files. When a plugin has a
config, the maubot admin panel will have a config editor for each instance of
the plugin, which can be used to conveniently modify the config at runtime.

## Quick start

To add configuration to your plugin, first create a file called
`base-config.yaml` with the default config. Let's use a simple example with a
user ID whitelist and a customizable command prefix:

```yaml
# Who is allowed to use the bot?
whitelist:
  - "@user:example.com"
# The prefix for the main command without the !
command_prefix: hello-world
```

After that, add `config` and `extra_files` to your `maubot.yaml`:

```yaml
config: true
extra_files:
  - base-config.yaml
```

Finally, define a `Config` class and implement the `get_config_class` method:

```python
from typing import Type
from mautrix.util.config import BaseProxyConfig, ConfigUpdateHelper
from maubot import Plugin, MessageEvent
from maubot.handlers import command


class Config(BaseProxyConfig):
  def do_update(self, helper: ConfigUpdateHelper) -> None:
    helper.copy("whitelist")
    helper.copy("command_prefix")


class ConfigurableBot(Plugin):
  async def start(self) -> None:
    self.config.load_and_update()

  def get_command_name(self) -> str:
    return self.config["command_prefix"]

  @command.new(name=get_command_name)
  async def hmm(self, evt: MessageEvent) -> None:
    if evt.sender in self.config["whitelist"]:
      await evt.reply("You're whitelisted 🎉")

  @classmethod
  def get_config_class(cls) -> Type[BaseProxyConfig]:
    return Config
```

## Config updates

The `do_update` method is called whenever the user modifies the config. The
purpose of the method is to copy values from the user-provided config into the
base config bundled with the plugin. The result of that update is then stored as
the actual plugin config.

The purpose of this is to ensure that the config data is always what the plugin
expects. If you make a config schema change, simply implement a migration in
`do_update`, and old configs will be automatically updated.

For example, say you wanted a more granular permission system than a whitelist.
First, you'd change the base config to only have your new schema:

```yaml
# Who is allowed to use the bot?
permissions:
  "@user:example.com": 100
# The prefix for the main command without the !
command_prefix: hello-world
```

Then, you'd implement a migration in the `do_update` method by checking if the
old field is present. When updating the config, `self` is the old or
user-specified config and `helper.base` is the base config that the values
should be copied to.

```python
from mautrix.util.config import BaseProxyConfig, ConfigUpdateHelper


class Config(BaseProxyConfig):
  def do_update(self, helper: ConfigUpdateHelper) -> None:
    if "whitelist" in self:
      # Give everyone in the old whitelist level 100
      helper.base["permissions"] = {user_id: 100
                                    for user_id in self["whitelist"]}
    else:
      # Config is already using new system, just copy permissions like usual
      helper.copy("permissions")
    helper.copy("command_prefix")
```

### Helper methods

The `ConfigUpdateHelper` contains two methods and properties:

* `base` - The contents of `base-config.yaml`.
* `source` - The old or user-specified config. This is the same as `self` in
  the `do_update` method.
* `copy(from_path, to_path)` - Copy a value from the source to the
  base. `from_path` is the path in the source (old/user-specified)
  config, while `to_path` is the path in the base config. If not specified,
  `to_path` will be the same as `from_path`. This will check if the value is
  present in the source config before copying it.
* `copy_dict(from_path, to_path, override)` - Copy entries in a dict from the
  source to the base. If `override` is set to false, keys that are in the base
  config but not in the source config will be kept in the end result, which is
  useful if you have a set of keys that must be defined.

## Modifying the config from the plugin

The config can also be modified by the plugin itself. Simply store whatever
values you want in the `self.config` dict, then call `self.config.save()`. The
config updater will not be ran when you save the config, but it will be ran when
the plugin is next reloaded, so make sure the updater won't remove your changes.
