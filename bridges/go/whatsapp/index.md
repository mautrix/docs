# mautrix-whatsapp
Welcome to the mautrix-whatsapp docs!

Use the sidebar to find the relevant pages. Things that are the same for all
bridges, like setting up the bridge, are right below the "Go-based bridges"
header. Things specific to mautrix-whatsapp are under this page.

These docs are mostly targeted towards people who are hosting the bridge
themselves. If you don't want to host it yourself, you can use a public
instance. When using public instances, refer to their instructions and support
rooms.

* [beeper.com](https://www.beeper.com/)
* [tchncs.de](https://tchncs.de/matrix)
  / [#tchncs:tchncs.de](https://matrix.to/#/#tchncs:tchncs.de)

If you run a public instance and wish to list it here, please [make a pull request](https://github.com/mautrix/docs/blob/master/bridges/go/whatsapp/index.md).

## Discussion
Matrix room: [#whatsapp:maunium.net](https://matrix.to/#/#whatsapp:maunium.net)

In case you need to upload your logs somewhere, be aware that they contain your
contacts' and your phone numbers. Strip them out with `| sed -r 's/[0-9]{10,}/📞/g'`
