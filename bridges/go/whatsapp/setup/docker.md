# WhatsApp bridge setup with Docker
## Requirements
* Docker
* A Matrix homeserver that supports application services
  (e.g. [Synapse](https://github.com/matrix-org/synapse))

## Setup
Docker images are hosted on [dock.mau.dev](https://mau.dev/mautrix/whatsapp/container_registry)

0. Create a directory for the bridge and cd into it:
   `mkdir mautrix-whatsapp && cd mautrix-whatsapp`.  
   **N.B.** The docker image will `chown` its `/data` directory to UID 1337.
   The commands below mount the working directory as `/data`, so make sure you
   always run them in the correct directory.
1. Pull the docker image with `docker pull dock.mau.dev/mautrix/whatsapp:latest`.
2. Run the container for the first time, so it can create a config file for you:
   ```
   docker run --rm -v `pwd`:/data:z dock.mau.dev/mautrix/whatsapp:latest
   ```
3. Update the config to your liking. Don't forget to change the `address` and
   `domain` to match those of your server, and add yourself to the `permissions`
   section.
4. Generate the appservice registration by running the container again, same
   command as above.
5. Add the path to the registration file (`registration.yaml` by default) to
   your Synapse's `homeserver.yaml` under the `app_service_config_files`
   section.
6. Restart Synapse to apply changes.
7. Run the bridge:
   ```
   docker run --restart unless-stopped -p 29318:29318 -v `pwd`:/data:z dock.mau.dev/mautrix/whatsapp:latest
   ```
   **N.B.** If using postgres database hosted at localhost/127.0.0.1 (outside
   the container), then use `--network=host` to avoid errors like
   `dial tcp 127.0.0.1:5432: connect: connection refused`

## Upgrading
1. Pull the new version (setup step 1)
2. Start the new version (setup step 7)
