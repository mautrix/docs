# Using bridges
This page contains a high-level overview of how to use bridges.

The first step is to decide which kind of bridge you want. Some bridges support
multiple types of bridging, but hosting providers may only enable one. The most
common types are puppeting and relaying.

* Puppeting means you log into the bridge with your real account on the remote
  network. The bridge will then automatically bridge all your chats. You can
  basically use Matrix as your client for other chat apps.
* Relaying means using some sort of a bot account on the remote network to
  bridge messages from multiple Matrix users. This is the usual method when you
  want to bridge individual community rooms so users can choose which side they
  want to be on.

mautrix bridges are primarily meant for puppeting, but some of them also have
[relay mode] (or a different equivalent system in the case of Telegram and
Discord).

[relay mode]: https://docs.mau.fi/bridges/general/relay-mode.html

After choosing which type of bridging you want, you'll need to find or host
a bridge. There are a few different options:

* Run it yourself. This requires hosting a full Matrix homeserver, as
  connecting bridges requires admin access (a friend who runs a homeserver
  might let you connect bridges too, but strangers probably won't).
  * The only exception to this rule is Beeper, which allows connecting
    self-hosted bridges. However, Beeper bridges can't be shared with other
    users, which means it can't be used for relaying.
* Pay someone to host it for you.
  * Hosting providers like etke.cc will set up bridges for you on request.
* Find a public instance
  * Some bridges have public instances which anyone can use.
  * Not all public instances allow all modes of bridging. For example, t2bot
    is only for relaying, while Beeper is only for puppeting.
  * The index pages of each bridge in these docs includes a list of known
    public instances. See [mautrix-telegram](../python/telegram/) for example.

For relay bridges, you can bridge any room you want. Matrix rooms are
decentralized, which means there's no such thing as the server that "hosts"
a room. If you find a bridge that you're allowed to use, you can add it to any
existing room.

After you have a bridge, you simply need to use it.

* For puppeting bridges, you should usually navigate to the "Authentication"
  page for the relevant bridge and follow the instructions (which always start
  with starting a chat with the bridge bot).
  * Some services like Beeper have built-in setup interfaces, in such cases
    you can ignore the docs and just use the UI.
* For relaying bridges, you generally have to invite the bot on the remote
  network and then use some commands to set up the bridge.
