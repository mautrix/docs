# HTTP handlers

Plugins can define custom HTTP endpoints that are published under the main
maubot web server. The endpoints can do anything from JSON APIs to fully fledged
websites.

Web handlers are disabled by default. You must set `webapp: true` in your
plugin's `maubot.yaml` to enable them. After that, simply decorate an aiohttp
handler method with `@web.method(path)` where `method` is the HTTP method,
e.g. `get` or `post`:

```python
from maubot import Plugin
from maubot.handlers import web
from aiohttp.web import Request, Response, json_response


class WebsiteBot(Plugin):
  @web.get("/id")
  async def get_id(self, req: Request) -> Response:
    return json_response({"id": self.id})

  @web.post("/data/{id}")
  async def post_data(self, req: Request) -> Response:
    data_id = req.match_info["id"]
    data = await req.text()
    self.log.debug(f"Received data with ID {data_id}: {data}")
    return Response(status=200)
```

The defined endpoints are reachable at
`http://your.maubot.instance/_matrix/maubot/plugin/<instance ID>/<path>`.
Plugins can find their own public web base URL in `self.webapp_url`.

The web server itself is [aiohttp]. Refer to the [aiohttp server docs] for more
info on how to make request handler methods, responses and other such things.
The `maubot.handlers.web` module is designed to work like
aiohttp's `RouteTableDef`, but there may be minor differences.

[aiohttp]: https://github.com/aio-libs/aiohttp

[aiohttp server docs]: https://docs.aiohttp.org/en/stable/web.html
