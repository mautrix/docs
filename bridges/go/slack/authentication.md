# Authentication
0. Open a private chat with the bridge bot. Usually `@slackbot:your.server`.
   * If the bot doesn't accept the invite, see the [troubleshooting page](../../general/troubleshooting.md)

## Password login

Password login supports all Slack features, except portals for Slack conversations will not be created immediately after login. If your Slack account does not have a password you need to use [token login](#token-login) or add a password to your account.

1. Send the command `login-password <email address> <slack team domain> <password>`, for example `login-password me@email.com workplacechat.slack.com hunter2`.

Password login isn't guaranteed to always be fully supported, but you can switch to token-based login at any time afterwards by following the instructions in the [Token login](#token-login) section without signing out.

## Token login

Token login works for any Slack account and fully supports all Slack features.

1. Start the Browser and open the Slack Web-App

	* Log into your slack-domain
	 (eg: https://<your_slackdomain>.slack.com/sign_in_with_password

	* Start the browser devtools
		- Firefox: `ctrl`-`shift`-`i` or `F12`
		- Chrome: `ctrl`-`shift`-`d` or `F12`

		* Extract the authentication token
		* Goto `app->local-storage` tab
		* Select the key called `localConfig_v2`
		* Inside the `teams` object, you get a list with all slack-domains you are authenticated to
		* extract the <token> element (it starts with `xoxc-`)

* Goto `app->cookies` tab
	* Select the element `https://app.slack.com`
		* extract the <cookie>, which is stored inside the key named `d`
		(it starts with `xoxd-`)

2. Swith into your Matrix Slack-Bot room
		* Issue the comman `login-token`

		```\n
		login-token <token> <cookie>
		e.g:
		login-token xoxc-tokengoeshere xoxd-cookiegoeshere
		```

After login using a token/cokie pair, all your joined channels will automatically
be bridged into Matrix. Your Direct Messages (DMs) will only appear once you receive
messages in them.
