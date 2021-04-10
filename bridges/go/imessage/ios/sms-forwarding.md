# SMS forwarding on iOS
If you're running the bridge on an old jailbroken iPhone, but want to keep your
SIM card in your main iPhone, you can use iMessage's SMS forwarding feature to
still send and receive text messages through the bridge.

By default, outgoing SMSes will only be forwarded on non-iPhone devices, and
it'll just throw a no sim card installed error if you try to send an SMS.
However, Brooklyn includes a bypass that can make the iPhone act like iPads
and Macs and forward the SMS through another iPhone.

To enable the bypass:

1. Deactivate iMessage (Settings -> Messages -> switch off "iMessage").
2. Enable the bypass in Settings -> Brooklyn.
3. Reset network settings (Settings -> General -> Reset -> Reset Network Settings).
   * The iPhone will forget your Wi-Fi settings and reboot.
4. Set up your Wi-Fi connection again.
5. Reactivate iMessage (same switch as step 1).
