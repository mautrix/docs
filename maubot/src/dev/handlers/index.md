# Handlers

Plugins can register various types of handlers using decorators from the
`maubot.handlers` module.

Currently, there are three types of handlers:

* `command` for conveniently defining command handlers.
* `event` for handling raw Matrix events.
* `http` for adding custom HTTP endpoints.

## Splitting handlers into multiple files

By default, maubot will only scan the plugin's main class for decorated methods.
If you want to split handlers into multiple files, you'll have to use the
`register_handler_class` method.

`second_handler.py`:

```python
from maubot import MessageEvent
from maubot.handlers import command


class SecondHandlerClass:
  @command.new()
  async def example(self, evt: MessageEvent) -> None:
    pass
```

`__init__.py`:

```python
from maubot import Plugin
from .second_handler import SecondHandlerClass


class SplitBot(Plugin):
  async def start(self) -> None:
    handler = SecondHandlerClass()
    self.register_handler_class(handler)

```
