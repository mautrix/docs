# Python bridge setup

{{ #include ../selector.html }}

This page contains instructions for setting up the bridge in a virtualenv.
You may also want to look at other ways to run the bridge:

* [Docker](../general/docker-setup.md)
* <span class="bridge-filter" bridges="telegram,signal,facebook"></span> YunoHost:
  <a href="https://github.com/YunoHost-Apps/mautrix_telegram_ynh">mautrix_telegram_ynh<span class="bridge-filter" bridges="telegram">,</span></a>
  <a href="https://github.com/YunoHost-Apps/mautrix_signal_ynh">mautrix_signal_ynh<span class="bridge-filter" bridges="signal">,</span></a>
  <a href="https://github.com/YunoHost-Apps/mautrix_facebook_ynh">mautrix_facebook_ynh<span class="bridge-filter" bridges="facebook"></span></a>
* [systemd service](#systemd-service) (at the bottom of this page)

Please note that everything in these docs are meant for server admins who want
to self-host the bridge. If you're just looking to use the bridges, check out
[Beeper], which provides fully managed instances of all of these bridges.

[Beeper]: https://www.beeper.com/

If you need help with setting up the bridge, you can ask in the Matrix room:
[#$bridge:maunium.net](https://matrix.to/#/#$bridge:maunium.net). For help with
setting up other parts like the homeserver that aren't the bridge, refer to
their documentation to find support rooms.

## Requirements
* Python 3.8 or higher with `pip` and `virtualenv`.
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/matrix-org/synapse)).
  You need access to register an appservice, which usually involves editing the homeserver config file.
* A PostgreSQL server, v10 or higher (which you should already have for Synapse).
  * Make sure you don't share databases between unrelated programs.
    Shared postgres instance is fine, but shared database is not.
* If installing optional dependencies, see the [optional dependencies](./optional-dependencies.md) page.
* <span class="bridge-filter" bridges="telegram">**mautrix-telegram**: </span>
  Telegram app ID and hash (get from [my.telegram.org](https://my.telegram.org/apps)).
* <span class="bridge-filter" bridges="telegram">**mautrix-telegram**: </span>
  [LottieConverter](https://github.com/sot-tech/LottieConverter) if you want
  animated stickers to be converted to something viewable on Matrix.
* <span class="bridge-filter" bridges="telegram,signal,facebook,instagram">**Bridges with voice messages**: </span>
  [ffmpeg](https://ffmpeg.org/) to transcode audio files (just install it with your system package manager).
* <span class="bridge-filter" bridges="signal">**mautrix-signal**: </span>
  An instance of [signald](https://gitlab.com/signald/signald).

## Production setup
0. Create a directory for the bridge. **Do not clone the repository.**
1. Set up a virtual environment.
   1. Create with `virtualenv -p /usr/bin/python3 .` (note the dot at the end)
      * You should not use a subdirectory for the virtualenv in this production
        setup. The `pip install` step places some required files at the root of
        the environment.
   2. Activate with `source ./bin/activate`
2. Install the bridge with `pip install --upgrade mautrix-$bridge[all]`
   * `[all]` at the end will install all optional dependencies. **This includes
     end-to-bridge encryption, which requires libolm3.** See the
     [optional dependencies page](./optional-dependencies.md) for more info.
   * If you want the master branch instead of a release, use
     `pip install --upgrade git+https://github.com/mautrix/$bridge.git#egg=mautrix-$bridge[all]`.
   * Make sure that you **don't** run pip with sudo.
3. Copy `example-config.yaml` to `config.yaml`.
4. Update the config to your liking. You'll at least need to change the
   homeserver settings, database address, and bridge permissions. If you miss
   something that's required, the bridge will refuse to start and tell you
   what's missing.
5. Generate the appservice registration with `python -m mautrix_$bridge -g`.
   You can use the `-c` and `-r` flags to change the location of the config and
   registration files. They default to `config.yaml` and `registration.yaml`
   respectively.
6. Register the bridge on your homeserver (see [Registering appservices]).
7. Run the bridge `python -m mautrix_$bridge`.

[Registering appservices]: ../general/registering-appservices.md

### Upgrading (production setup)
0. Make sure you're in the virtualenv (`source ./bin/activate`).
1. Run the bridge install command again (install step #2).

## Development setup
0. Clone the repository.
1. _Optional, but strongly recommended:_ Set up a virtual environment.
   1. Create with `virtualenv -p /usr/bin/python3 .venv`
   2. Activate with `source .venv/bin/activate`
2. Install dependencies with `pip install --upgrade -r requirements.txt`
   * Optionally, add `-r optional-requirements.txt` to install optional
     dependencies. Some of the optional dependencies may need additional native
     packages. See the [optional dependencies page](./optional-dependencies.md)
     for more info.
3. Continue from step #3 of production setup.
4. For linting: `pip install -r dev-requirements.txt` to install Black, isort
   and pre-commit, then install the Git hook with `pre-commit install`. This
   will ensure that code is properly formatted when you commit, to avoid having
   to fix linting errors when the CI complains.

### Upgrading (development setup)
0. Make sure you're in the virtualenv (`source .venv/bin/activate`).
1. Pull changes from Git.
2. Run the dependency install command again (install step #2).

## systemd service
1. Create a user for the bridge:
   ```shell
   $ sudo adduser --system mautrix-$bridge --home /opt/mautrix-$bridge
   ```
2. Follow the [production setup instructions](#production-setup) above.
   Make sure you use that user and home directory for the bridge.
4. Create a systemd service file at `/etc/systemd/system/mautrix-$bridge.service`:
   ```ini
   [Unit]
   Description=mautrix-$bridge bridge

   [Service]
   # N.B. If you didn't create a user with the correct home directory, set this
   #      to the directory where config.yaml is (e.g. /opt/mautrix-$bridge).
   WorkingDirectory=~
   ExecStart=/opt/mautrix-$bridge/bin/python -m mautrix_$bridge
   User=mautrix-$bridge

   [Install]
   WantedBy=multi-user.target
   ```
