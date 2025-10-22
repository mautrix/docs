# Basic usage
After setting up maubot, you can use the web management interface to make it do
things. The default location of the management interface is <http://localhost:29316/_matrix/maubot>.

Logging into the interface happens with the credentials configured in the
`admins` section in the config. Note that the `root` user can't have a password,
so you must use a different username for logging in.

## Uploading plugins
Plugins contain the actual code for a bot, so the first step is to upload a
plugin. There's currently no central location to download plugins, but there's
a list of plugins at [plugins.mau.bot](https://plugins.mau.bot/).

Common places to get plugins:
* GitHub releases (assets section), e.g. <https://github.com/maubot/echo/releases>
* mau.dev CI, e.g. <https://mau.dev/maubot/github/-/pipelines>
* Cloning the repo and building it yourself:
  * `mbc build` will package everything properly and output the `.mbp` file
  * you can also zip it yourself with `zip -9r plugin.mbp *`

After you have the `.mbp` file, click the `+` button next to the "Plugins"
header and drop your `.mbp` file in the upload box.

## Creating clients
Each Matrix account you want to use as a bot needs to be added as a client. You
could have one bot account that does everything, or many bot accounts with
different purposes. To create a client, click the `+` button next to the
"Clients" header and fill in the form.

* The homeserver dropdown gets values from the config's `homeservers` section,
  but you can also type a full URL in that box.
* The access token and device ID are acquired by logging into the account.
  There are several ways to do that, including the [`mbc auth`] command included
  in maubot.
  * Reusing tokens from other clients is strongly discouraged. You should always
    make a fresh token. Reusing tokens will break encryption entirely and can
    cause other issues as well.
* The avatar URL can be left empty, you can upload an image after creating the
  client.
* Both the display name and avatar URL can be set to `disable` if you don't want
  maubot to change them. If left empty, maubot will *remove* the displayname and
  avatar on Matrix.

[`mbc auth`]: cli/auth.md

## Creating instances
Instances are how plugins are linked to clients. After you have uploaded a
plugin and created a client, simply click the `+` button next to the "Instances"
header, choose your client and plugin in the relevant dropdowns, invent an
instance ID and click "Create".

You may have to refresh the management UI if the plugin and client you created
don't show up in the dropdowns.

If the plugin has any configuration options, the config editor will show up
under the created instance.
