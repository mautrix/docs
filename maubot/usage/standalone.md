# Standalone mode

The normal mode in maubot is very dynamic: the config file doesn't really
contain any runtime details other than a general web server, database, etc.
Everything else is set up at runtime using the web management interface or
the [management API](../management-api.md) directly. This dynamicness is very
useful for developing bots and works fine for deploying it on personal servers,
but it's not optimal for larger production deployments.

The solution is standalone mode: a separate entrypoint that runs a single maubot
plugin with a predefined Matrix account.

Additionally, standalone mode supports using appservice transactions to receive
events instead of /sync, which is often useful for huge production instances
with lots of traffic.

## Basic usage

0. Set up a virtual environment.
   1. Create with `virtualenv -p /usr/bin/python3 .venv`
   2. Activate with `source .venv/bin/activate`
1. Install maubot into the virtualenv with `pip install --upgrade maubot[all]`
   * `[all]` at the end will install all optional dependencies!
     The e2ee optional dependency requires libolm3 to be installed natively.
   * Alternatively install the latest git version with
     `pip install --upgrade git+https://github.com/maubot/maubot.git#egg=maubot[all]`
2. Extract the plugin you want to run into the directory
   * `.mbp` files can be extracted with `unzip`.
   * You can also just clone the plugin repository and use it directly.
   * After extracting, you should have `maubot.yaml` and some Python modules in
     the directory.
3. Install any dependencies that the plugin has into the virtualenv manually
   (they should be listed in `maubot.yaml`).
4. Copy the [standalone example config] to the same directory as `config.yaml`
   and fill it out.
   * If the plugin has a config, you should copy the contents from the plugin's
     `base-config.yaml` into the `plugin_config` object in the standalone config,
     then fill it out as needed.
5. Run the bot with `python -m maubot.standalone`

[standalone example config]: https://github.com/maubot/maubot/blob/master/maubot/standalone/example-config.yaml
