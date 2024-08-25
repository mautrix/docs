# Authentication
You may want to use [mautrix-manager](https://github.com/mautrix/manager)
instead of bot commands if you want to do token login. It will automate
extracting cookies so you don't need to mess with browser devtools.

0. Open a private chat with the bridge bot. Usually `@slackbot:your.server`.
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)

## Token login
1. Login to the Slack web app in a browser, and acquire the authentication
   token and `d` cookie from inside the app.
   * The token starts with `xoxc-` and can be found using the browser devtools,
     in localStorage inside the `localConfig_v2` object:
     ```javascript
     JSON.parse(localStorage.localConfig_v2).teams.YOUR_TEAM_ID_HERE.token
     ```
   * The cookie is named `d` and starts with `xoxd-`.
2. Send `login token <token> <cookie>` to the bot.

After login, the bridge will bridge recent chats automatically
(depending on the `conversation_count` setting).

## App login
If using app login for relay mode, it is recommended to create a new Matrix
account. If you do this with your primary account, your messages will be bridged
with the app's profile rather than a custom profile.

1. Create a new Slack app using the [app manifest](https://github.com/mautrix/slack/blob/main/app-manifest.yaml)
   in the bridge repo.
2. Create an app-level token for the app to get a `xapp-` token.
3. Install the app in your workspace to get a `xoxb-` token.
4. Send `login app` to the bot.
5. Send the bot token and app-level token when requested.

After login, the bridge will bridge the chats the bot is in automatically.
If using `set-relay`, any unauthenticated users will be bridged through the app
with a custom name & avatar. Note that the user who did `login app` will **not**
get a custom name and avatar (hence the recommendation for a dedicated Matrix
account at the start).
