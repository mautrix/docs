# Setup
## Requirements
* Python 3.9 or higher with `pip` and `virtualenv`
* (For dev setup) [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/en/docs/install)

## Production setup
1. Create a directory (`mkdir maubot`) and enter it (`cd maubot`).
   **Do not clone the repository.** If you want to use a specific version from
   git rather than PyPI, use the development setup instructions.
2. Set up a virtual environment.
   1. Create with `virtualenv -p /usr/bin/python3 .` (note the dot at the end)
      * You should not use a subdirectory for the virtualenv in this production
        setup. The pip install step places some required files at the root of
        the environment.
   2. Activate with `source ./bin/activate`
3. Install with `pip install --upgrade maubot`
4. Copy `example-config.yaml` to `config.yaml` and update to your liking.
5. Create the log directory and all directories used in `plugin_directories`
   (usually `mkdir plugins trash logs`).
6. Start with `python3 -m maubot`.
7. The management interface should now be available at
   <http://localhost:29316/_matrix/maubot> or whatever you configured.

### Upgrading
1. Run the install command again (step #3).
2. Restart maubot.

## Development setup
0. Clone the repository.
1. _Optional, but strongly recommended:_ Set up a virtual environment.
   1. Create with `virtualenv -p /usr/bin/python3 .venv`
   2. Activate with `source .venv/bin/activate`
2. Install with `pip install --editable .` (note the dot at the end)
3. Build the frontend:
   1. `cd maubot/management/frontend`
   2. Install dependencies with `yarn`
   3. Build with `yarn build`
4. _Optional:_ Configure [debug file open] so that you can open files in your
   IDE by clicking on stack trace lines in the frontend log viewer.
5. Continue from step 4 of the production setup. Note that the example config
   to copy will be inside the `maubot` directory, not in the repo root.

[debug file open]: ../../management-api.md#debug-file-open

### Upgrading
1. Pull changes from Git.
2. Update dependencies with `pip install --upgrade -r requirements.txt`.
3. Restart maubot.
