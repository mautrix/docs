# Command handlers

Commands are the most common way of interacting with bots. The command system in
maubot lets you define commands, subcommands, argument parsing and more.

The simplest command handler is just a method that takes a `MessageEvent` and is
decorated with `@command.new()`. The `MessageEvent` object contains all the info
about the event (sender, room ID, timestamp, etc) and some convenience methods,
like replying to the command (`evt.reply`). See the [MessageEvent reference] for
more details on that.

[MessageEvent reference]: ../../reference/message-event.md

```python
from maubot import Plugin, MessageEvent
from maubot.handlers import command


class SimpleBot(Plugin):
  @command.new()
  async def command(self, evt: MessageEvent) -> None: ...
```

## `@command.new()` parameters

The `@command.new()` decorator has various parameters which can be used to
change how the command itself works:

### `name`

The name of the command. This defaults to the name of the method. The parameter
can either be a string, or a function. The function can take either zero or one
argument (the `Plugin` instance). The latter case is meant for making the name
configurable.

A command defined like this would be ran with `!hello-world`:

```python
from maubot import Plugin, MessageEvent
from maubot.handlers import command


class CustomNameBot(Plugin):
  @command.new(name="hello-world")
  async def hmm(self, evt: MessageEvent) -> None: ...
```

Here `get_command_name` is a function that takes one argument, `self`. It then
gets the `command_prefix` config field and returns that as the command prefix.
See the [Configuration] page for details on how to have a config for the plugin.

[Configuration]: <> (../configuration.md)

```python
from maubot import Plugin, MessageEvent
from maubot.handlers import command


class RenamingBot(Plugin):
  def get_command_name(self) -> str:
    return self.config["command_prefix"]

  @command.new(name=get_command_name)
  async def hmm(self, evt: MessageEvent) -> None: ...
```

### `help`

A short help text for the command. This essentially just adds some metadata to
the function that contains the help text. The metadata is currently only used
for subcommands (for commands that require a subcommand, no arguments will
produce a help message), but it's theoretically possible to use it for other
purposes too.

### `aliases`

This defines additional names for the command. Aliases can be used to trigger
the command, but they won't show up in help texts or other such things. The
parameter is similar to `name`: it can either be a tuple/list/set, or a
function.

The function takes one or two parameters (either just the command, or the plugin
instance and the command) and returns a boolean to indicate whether the given
parameter is a valid alias for the command.

If the parameter is a function, it must return `True` for the primary command
name. If it's a list, it doesn't have to include the primary name.

```python
from maubot import Plugin, MessageEvent
from maubot.handlers import command


class RenamingAliasBot(Plugin):
  def is_match(self, command: str) -> bool:
    return command == "hmm" or command in self.config["command_aliases"]

  @command.new(aliases=is_match)
  async def hmm(self, evt: MessageEvent) -> None: ...
```

### `event_type` and `msgtypes`

Command handlers are fundamentally just wrappers for [raw event handlers]. The
`event_type` and `msgtype` parameters can be set to change what event and
message types the command handler reacts to.

`event_type` is a single `EventType`, defaulting to `EventType.ROOM_MESSAGE`.
Multiple event types for a command handler are currently not supported.
`msgtypes` is any iterable (list, tuple, etc) of allowed `MessageType`s, it
defaults to only allowing `MessageType.TEXT`.

[raw event handlers]: ../events.md

### `require_subcommand`

This parameter makes the command always output a help message if a subcommand
wasn't used. This defaults to true, but it only affects commands that have at
least one subcommand defined. You should change this to `False` if your
top-level command has its own functionality. For example, the XKCD bot
has `!xkcd <number>` as a top-level command with one argument, and some
subcommands like `!xkcd search <query>`.

### `arg_fallthrough`

For commands with both subcommands and top-level arguments, this parameter can
be used to make the top-level arguments fall through to the subcommand handlers.
The command will be parsed
as `!<command> <top-level arguments> <subcommand> <subcommand arguments>`

### `must_consume_args`

Whether the command definition has to consume all arguments that the user
provides. If this is true (the default), then any arguments that can't be parsed
will cause the bot to send a help message instead of executing the command
handler.
