# Bridge setup

These instructions are for a simple virtualenv-based setup. You can also set up
[with Docker](./docker.md), or [set up systemd](./systemd.md) to run the bridge
with this virtualenv setup.

{{ #include ../selector.html }}

## Requirements
* Python 3.7 or higher with `pip` and `virtualenv`.
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/matrix-org/synapse))
* A PostgreSQL server (which you should already have for Synapse).
* If installing optional dependencies, see the [optional dependencies](../optional-dependencies.md) page.
* <span class="bridge-filter" bridges="telegram">**mautrix-telegram**: </span>
  Telegram app ID and hash (get from [my.telegram.org](https://my.telegram.org/apps)).
* <span class="bridge-filter" bridges="signal">**mautrix-signal**: </span>
  An instance of [signald](https://gitlab.com/signald/signald).

## Production setup
0. Create a directory for the bridge.
1. Set up a virtual environment.
   1. Create with `virtualenv -p /usr/bin/python3 .`  
      **N.B.** Do not use a subdirectory for the virtualenv in this production
      setup. The `pip install` step places some required files at the root of
      the environment.**
   2. Activate with `source ./bin/activate`
2. Install the bridge with `pip install --upgrade mautrix-$bridge[all]`
   * `[all]` at the end will install all optional dependencies. **Some optional
     dependencies require additional native packages.** See the
     [optional dependencies page](../optional-dependencies.md) for more info.
   * If you want the master branch instead of a release, use
     `pip install --upgrade git+https://github.com/tulir/mautrix-$bridge.git#egg=mautrix-$bridge[all]`.
3. Copy `example-config.yaml` to `config.yaml`.
4. Update the config to your liking. You'll at least need to change the
   homeserver settings and permissions. If you miss something that's required,
   the bridge will refuse to start and tell you what's missing.
5. Generate the appservice registration with `python -m mautrix_$bridge -g`.
   You can use the `-c` and `-r` flags to change the location of the config and
   registration files. They default to `config.yaml` and `registration.yaml`
   respectively.
6. Add the path to the registration file (`registration.yaml` by default) to
   your Synapse's `homeserver.yaml` under `app_service_config_files`.
   Restart Synapse to apply changes.
7. <span class="bridge-filter" bridges="telegram,hangouts">**For mautrix-telegram and mautrix-hangouts only:**</span>
   Initialize the database with `alembic upgrade head`. If you have a custom config
   path, use `alembic -x config=/path/to/config.yaml upgrade head`.
8. Run the bridge `python -m mautrix_$bridge`.

### Upgrading
1. Run the bridge install command again (install step #2).
2. Update the database with the command in install step #7.
   <span class="bridge-filter" bridges="telegram,hangouts"/>

## Development setup
0. Clone the repository.
1. _Optional, but strongly recommended:_ Set up a virtual environment.
   1. Create with `virtualenv -p /usr/bin/python3 .venv`
   2. Activate with `source .venv/bin/activate`
2. Install dependencies with `pip install -r requirements.txt`
   * Optionally, add `-r optional-requirements.txt` to install optional
     dependencies. Some of the optional dependencies may need additional native
     packages. See the [optional dependencies page](../optional-dependencies.md)
     for more info.
3. Continue from step #3 of production setup.

### Upgrading
1. Pull changes from Git.
2. Update dependencies with `pip install --upgrade -r requirements.txt`.
   * If you installed optional dependencies, run the same `pip` command as when installing them, but with `--upgrade`
3. Update the database with the command in install step #7.
   <span class="bridge-filter" bridges="telegram,hangouts"/>
