# Events

Raw event handlers can be used to handle any incoming Matrix events. They don't
have any kind of filters, so make sure to ignore echo events from the bot itself
if necessary.

```python
from maubot import Plugin
from maubot.handlers import event
from mautrix.types import EventType, StateEvent


class RawEventHandlingBot(Plugin):
  @event.on(EventType.ROOM_TOMBSTONE)
  async def handle_tombstone(self, evt: StateEvent) -> None:
    self.log.info(f"{evt.room_id} was upgraded into "
                  f"{evt.content.replacement_room}")
    await self.client.send_text(evt.room_id, "🪦")
```

If you want to handle custom events, you'll have to construct an `EventType`
instance first:

```python
from maubot import Plugin
from maubot.handlers import event
from mautrix.types import EventType, GenericEvent

custom_event = EventType.find("com.example.custom",
                              t_class=EventType.Class.MESSAGE)


class CustomEventHandlingBot(Plugin):
  @event.on(custom_event)
  async def handle_custom_event(self, evt: GenericEvent) -> None:
    self.log.info("Custom event data: %s", evt.content)
```

The `t_class` field defines what type of event you want. For normal room events,
it's either `MESSAGE` or `STATE`. If you set it to `STATE`, your handler won't
receive any non-state events, which is meant to protect from a fairly common
class of bugs.
