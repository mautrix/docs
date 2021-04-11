# Subcommands

For more complicated bots, it's often useful to have multiple distinct command
handlers for different tasks. While it's technically possible to use separate
commands, it might be nicer to have everything under a single command. To do
this, maubot allows you to define subcommands.

Subcommands are defined by using the `.subcommand()` decorator of a top-level
command that was defined earlier:

```python
from maubot import Plugin, MessageEvent
from maubot.handlers import command


class SimpleBot(Plugin):
  @command.new(name="hello", require_subcommand=True)
  async def base_command(self, evt: MessageEvent) -> None:
    # When you require a subcommand, the base command handler
    # doesn't have to do anything.
    pass

  @base_command.subcommand(help="Do subcommand things")
  async def subcommand(self, evt: MessageEvent) -> None:
    await evt.react("subcommand!")
```

In this case, the subcommand handler would be triggered by `!hello subcommand`.
If you send just `!hello`, it will respond with a help page. The `help` argument
from the subcommand decorator is how the help page is populated.

The `subcommand` decorator has the same parameters as top-level commands, except
it can't define the `event_type` and `msgtypes` that the handler catches. You
can also nest subcommands as deep as you like (i.e. in the above example,
`@subcommand.subcommand()` is a valid decorator for a third method).
