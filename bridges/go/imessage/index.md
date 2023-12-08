# mautrix-imessage
Welcome to the mautrix-imessage docs!

**Note: This bridge is no longer actively maintained.**

mautrix-imessage is a Matrix-iMessage puppeting bridge. The bridge has three
different ways to connect to iMessage:

* Normal Mac. Built into mautrix-imessage. Uses AppleScript to send, reads the
  iMessage SQLite database to receive, and uses Contacts.framework for contact
  list access.
* Mac with SIP disabled. Uses [Barcelona] to hook into Apple's private iMessage
  frameworks on a Mac. Requires disabling SIP and AMFI to be able to hook into
  private frameworks.
* ~~Jailbroken iOS. Uses [Brooklyn] to hook into Apple's private iMessage
  frameworks on a jailbroken iOS device.~~ 32-bit support has been deprecated,
  Barcelona can be used on newer iOS devices.
* Additionally, there's [android-sms], an Android app that implements the same
  [IPC protocol] as Brooklyn and Barcelona to bridge SMS from an Android phone.
  * Note that the [Google Messages bridge](../gmessages/) is now recommended
    over android-sms.

You can find setup instructions for each of the connectors in the sidebar.

This bridge essentially has to be self-hosted, so you likely won't find public
instances on normal Matrix servers, but [Beeper](https://www.beeper.com) does
offer hosted iMessage bridges (using the Barcelona connector) and the Beeper
Android app has the android-sms bridge built in.

[Barcelona]: https://github.com/beeper/barcelona
[Brooklyn]: https://github.com/EthanRDoesMC/Brooklyn
[android-sms]: https://gitlab.com/beeper/android-sms
[IPC protocol]: https://github.com/mautrix/imessage/blob/master/imessage/ios/ipc.md

## Discussion
Matrix room: [#imessage:maunium.net](https://matrix.to/#/#imessage:maunium.net)
