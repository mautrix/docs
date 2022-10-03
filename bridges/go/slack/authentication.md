# Authentication
0. Open a private chat with the bridge bot. Usually `@slackbot:your.server`.
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)

## Password login

Password login supports all Slack features, except portals for Slack conversations will not be created immediately after login. If your Slack account does not have a password you need to use [token login](#token-login) or add a password to your account.

1. Send the command `login-password <email address> <slack team domain> <password>`, for example `login-password me@email.com workplacechat.slack.com hunter2`.

Password login isn't guaranteed to always be fully supported, but you can switch to token-based login at any time afterwards by following the instructions in the [Token login](#token-login) section without signing out.

## Token login

Token login works for any Slack account and fully supports all Slack features.

1. Login to the Slack web app in a browser, and acquire the authentication token and `d` cookie from inside the app.
   * The token starts with `xoxc-` and can be found using the browser devtools, in the app's local storage inside the `localConfig_v2` object, as `teams['your team ID'].token`.
   * The cookie is named `d`, it starts with `xoxd-` and can be found in the cookies section in the devtools.
2. Send the command `login-token <token> <cookie>`, for example `login-token xoxc-tokengoeshere xoxd-cookiegoeshere`

After login using a token, all your joined channels will automatically be bridged into Matrix, but DMs will only appear once you receive messages in them.