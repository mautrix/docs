# Passive command handlers

Passive commands are command handlers that don't follow a strict syntax
like `!command <arguments>`, but instead just match some regular expressions
anywhere in a message.

Passive commands are created using the `@command.passive(regex)` decorator.
The `regex` is a required argument. It can either be a string (in which case
maubot will compile it) or a pre-[`re.compile`]'d Pattern object.

[`re.compile`]: https://docs.python.org/3/library/re.html#re.compile

```python
from typing import Tuple
from maubot import Plugin, MessageEvent
from maubot.handlers import command


class PassiveBot(Plugin):
  @command.passive("cat")
  async def command(self, evt: MessageEvent, match: Tuple[str]) -> None:
    await evt.react("🐈️")
```

## Handler parameters

Like command handlers, the first parameter is the `MessageEvent` object. In
addition to that, passive commands always have a second parameter. By default,
the parameter is a tuple where the first element is the full match, and the
following elements are individual capture groups. If the `multiple` flag is set,
then the parameter is an array containing one or more such tuples.

## `@command.passive()` parameters

### `field`

This defines which field to run the regex against in the event content. The
parameter is a function that takes a single argument, the event object. The
default value will return `evt.content.body` (i.e. the plaintext body of the
message).

### `multiple`

...

### `event_type` and `msgtypes`

These work the same way as [in `@command.new()`]

[in `@command.new()`]: ./index.md#event_type-and-msgtypes

### `case_insensitive`, `multiline` and `dot_all`

These parameters enable regex flags. They only apply if you pass a string
instead of a compiled pattern as the regex. They set the [`re.IGNORECASE`]
, [`re.MULTILINE`] and [`re.DOTALL`] flags respectively.

[`re.IGNORECASE`]: https://docs.python.org/3/library/re.html#re.IGNORECASE
[`re.MULTILINE`]: https://docs.python.org/3/library/re.html#re.MULTILINE
[`re.DOTALL`]: https://docs.python.org/3/library/re.html#re.DOTALL
