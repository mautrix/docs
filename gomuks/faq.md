# FAQ

## How do I verify the gomuks session?
To self-sign the device using your security key, use `/cs fetch`, enter your
security key in the dialog that appears, then use `/cs self-sign`.

Alternatively, find yourself in the user list on Element Web or Desktop, click
on "X sessions", click on the gomuks session and use "Manually verify by text",
then compare the fingerprint to what gomuks outputs with the `/fingerprint`
command. Note that the text verification option is not available in the
security & privacy settings, it's only in the right panel user list.

## Why are old messages undecryptable?
gomuks currently doesn't support key backup and doesn't request keys
automatically, so only messages sent after initial login will be decryptable.
To see older messages, export keys to file from another client and use the
`/import` command.

## How do I use a proxy?
Go's HTTP library reads the `https_proxy` environment variable by default
(see <https://pkg.go.dev/net/http#ProxyFromEnvironment> for more info).
