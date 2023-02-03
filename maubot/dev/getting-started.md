# Getting started

This guide assumes you already have a maubot instance set up.

A maubot plugin file (`.mbp`) is a zip file that contains `maubot.yaml` and some
Python modules. The `maubot.yaml` file contains metadata for maubot, such as the
plugin's ID and what Python modules it contains.

The [Plugin metadata](./reference/plugin-metadata.md) page documents all options
available in `maubot.yaml`. A minimal meta file looks like this:

```yaml
maubot: 0.1.0
id: com.example.examplebot
version: 1.0.0
license: MIT
modules:
  - examplebot
main_class: ExampleBot
```

The file above will tell maubot to load the `examplebot` Python module and find
the `ExampleBot` class inside it. Note that Python modules are currently loaded
into the global context, so they must be unique. The class must inherit the
`Plugin` class from maubot. A simple bot that does nothing would therefore look
like this:

```python
from maubot import Plugin


class ExampleBot(Plugin):
  pass
```

A bot that does nothing is a bit boring, so let's make it do something. The
`maubot.handlers` module contains decorators that can be used to define event
handlers, chat commands and HTTP endpoints. Most bots use commands, so let's
start with that.

The simplest command handlers are simply methods that take one parameter (the
event) and are decorated with `@command.new()`. The method name will be used as
the command.

```python
from maubot import Plugin, MessageEvent
from maubot.handlers import command


class ExampleBot(Plugin):
  @command.new()
  async def hello_world(self, evt: MessageEvent) -> None:
    await evt.reply("Hello, World!")
```

With the maubot.yaml meta file above and this Python file saved as
`examplebot/__init__.py`, you can build the plugin and try it out. To build
plugins, you can either use `mbc build` or just zip it yourself
(`zip -9r plugin.mbp *` in the directory with `maubot.yaml`). After you have
the `.mbp` file, upload it to your maubot instance (see [Basic usage]), then try
to use the `!hello-world` command.

If you make any changes, you can use [`mbc build --upload`] to build and upload
the plugin directly to the server. Any plugin instances will be reloaded
automatically so you can try out your changes immediately after uploading.

[Basic usage]: ../usage/basic.md

[`mbc build --upload`]: ../usage/cli/build.md
