# Python tips

This page collects various details about Python and how maubot uses modern
Python features. It is not yet ready, but the info below might already be of
some use.

## asyncio

maubot and mautrix-python use the [asyncio] library in Python 3. This means that
everything is single-threaded, but still asynchronous.

When writing a plugin that interacts with some network service, it is strongly
recommended to use asyncio libraries for that interaction. If you use a
traditional synchronous library, it will block everything else running on the
same maubot instance.

For example, if you need to make HTTP requests, use [aiohttp] instead of
requests. Plugins have convenient access to an aiohttp client instance through
the `http` property in the plugin base class.

If there are no asyncio libraries available for the thing you want to do, you
can run the synchronous methods in a separate thread using asyncio's built-in
[`run_in_executor`] with a `ThreadPoolExecutor`.

[asyncio]: https://docs.python.org/3/library/asyncio.html
[aiohttp]: https://github.com/aio-libs/aiohttp
[`run_in_executor`]: https://docs.python.org/3/library/asyncio-eventloop.html#executing-code-in-thread-or-process-pools

If you haven't used asyncio before, you may want to read a guide on the topic
before developing maubot plugins. Some potentially good ones are:

* <https://lonami.dev/blog/asyncio/> (short)
* <https://realpython.com/async-io-python/> (a bit longer)
* <https://superfastpython.com/python-asyncio/> (very long)

## Type hints

Most of the methods in maubot and mautrix-python have proper type hints. Even
Matrix events are parsed into convenient type-hinted objects. Using an editor
that provides autocompletion based on type hints is recommended.
