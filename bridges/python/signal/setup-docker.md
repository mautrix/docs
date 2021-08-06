# Signal bridge setup with Docker
## Requirements
* Docker
* [Docker Compose](https://docs.docker.com/compose/install/), or knowledge how
  to read a docker-compose file and run the docker containers yourself.
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/matrix-org/synapse))

## Notes
* ~~These instructions use the `dock.mau.dev/maunium/signald` image instead of
  `docker.io/finn/signald` for signald, as the former has a more recent version
  of Java and a sane default data directory.~~ The upstream image has been
  updated to match the maunium image.
* By default, the bridge runs as root. You can run it as a different user, but
  make sure you `chown` all the files and make signald run as the same user.

## Setup
0. Create a directory for the bridge and cd into it: `mkdir mautrix-signal && cd mautrix-signal`.
1. Create `docker-compose.yml` that contains something like this:
   ```yaml
   version: "3.7"

   services:
     mautrix-signal:
       container_name: mautrix-signal
       image: dock.mau.dev/mautrix/signal
       restart: unless-stopped
       volumes:
       - ./bridge:/data
       - ./signald:/signald
       depends_on:
       - signald
     signald:
       container_name: signald
       image: docker.io/finn/signald
       restart: unless-stopped
       volumes: 
       - ./signald:/signald
     db:
       image: postgres:13-alpine
       restart: unless-stopped
       environment:
         POSTGRES_USER: mautrixsignal
         POSTGRES_DATABASE: mautrixsignal
         POSTGRES_PASSWORD: foobar
       volumes:
       - ./db:/var/lib/postgresql/data
   ```
2. Run `docker-compose up -d signald` to start signald and make sure it doesn't
   crash.
3. Run `docker-compose up mautrix-signal` to make the bridge generate a config
   file for you.
4. Update the config to your liking.
   * As usual, you'll at least need to change the homeserver settings and add
     yourself to the permissions section.
   * Only postgres is supported as the bridge database, so configure that too.
     If you use the docker-compose example above directly,
     use `postgres://mautrixsignal:foobar@db/mautrixsignal` as the database URI
     (but **change the password to something else than `foobar`**).
   * Additionally, you need to update the paths in the `signal` section:
     * `socket_path` is `/signald/signald.sock`.
     * `outgoing_attachment_dir` should be `/signald/attachments` (if you can
       figure out how, you could even use a shared tmpfs for that directory to
       avoid unencrypted files being temporarily stored on disk).
     * `avatar_dir` is `/signald/avatars`.
5. Generate the appservice registration by running the container again, same
   command as above.
6. Add the path to the registration file to your Synapse's `homeserver.yaml`
   under the `app_service_config_files` section.
7. Restart Synapse to apply changes.
8. Run `docker-compose up -d` to start the bridge.

## Upgrading
1. `docker-compose pull`
2. `docker-compose up -d`
