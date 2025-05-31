# Setup with Docker

This page contains instructions for setting up Meowlnir in Docker.

## Requirements
* Docker
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/element-hq/synapse))
  You need access to register an appservice, which usually involves editing the
  homeserver config file.

## Setup
Docker images are hosted on dock.mau.dev. Available docker tags are generally
`:latest`, `:git tag`, `:git commit-amd64` and `:git commit-arm64`. The latest
and git tag specific docker tags are manifests that contain both amd64 and
arm64 images. `:latest` points at the latest commit, not the latest release.

0. Create a directory for Meowlnir and cd into it: `mkdir meowlnir && cd meowlnir`.  
1. Pull the docker image with `docker pull dock.mau.dev/maunium/meowlnir:<version>`.
   Replace `<version>` with the version you want to run (e.g. `latest` or `v0.6.0`).
2. Follow the [configuration instructions](./config.md) to create a config file
   and registration.
   * To generate the example config using the `-e` flag mentioned in the docs,
     run the container with `/usr/bin/meowlnir -e` as arguments:
     ```
     docker run --rm -v `pwd`:/data:z dock.mau.dev/maunium/meowlnir:<version> /usr/bin/meowlnir -e
     ```
   * Keep in mind that `localhost` is not the correct address inside Docker
     (unless using `network=host` mode). Usually you should have Meowlnir and
     homeserver in the same Docker network, and use the container names as
     addresses (e.g. `http://meowlnir:29339` and `http://synapse:8008`).
3. Register the registration file with your homeserver
   (see [Registering appservices] in the bridge docs for details).
4. Run Meowlnir:
   ```
   docker run --restart unless-stopped -v `pwd`:/data:z dock.mau.dev/maunium/meowlnir:<version>
   ```
   Additionally, you should either add Meowlnir to the same Docker network as
   Synapse with `--network=synapsenet` (when both are running in Docker), or
   expose the correct port with `-p 29339:29339` (when the homeserver is outside
   Docker).
5. Follow the instructions on the [Creating bots](./bot-create.md) page to
   actually initialize your bot, then the [Configuring bots](./bot-config.md)
   page to tell the bot what to do.

[Registering appservices]: https://docs.mau.fi/bridges/general/registering-appservices.html

## Upgrading
1. Pull the new version (setup step 1)
2. Start the new version (setup step 6)

## Docker compose
0. Create a directory for Meowlnir like step #0 in the Docker CLI instructions
   above.
1. Create `docker-compose.yml` that contains something like this:
   ```yaml
   version: "3.7"

   services:
     meowlnir:
       container_name: meowlnir
       image: dock.mau.dev/maunium/meowlnir:<version>
       restart: unless-stopped
       volumes:
       - .:/data

       # If you put the service above in the same docker-compose as the homeserver,
       # ignore the parts below. Otherwise, see below for configuring networking.

       # If synapse is running outside of docker, you'll need to expose the port.
       # Note that in most cases you should either run everything inside docker
       # or everything outside docker, rather than mixing docker things with
       # non-docker things.
       #ports:
       #- "29339:29339"
       # You'll also probably want this so Meowlnir can reach Synapse directly
       # using something like `http://host.docker.internal:8008` as the address:
       #extra_hosts:
       #- "host.docker.internal:host-gateway"

       # If synapse is in a different network, then add this container to that network.
       #networks:
       #- synapsenet
   # This is also a part of the networks thing above
   #networks:
   #  synapsenet:
   #    external:
   #      name: synapsenet

   ```
2. Follow the rest of the Docker setup, but use compose commands instead of the
   raw `docker` commands: `docker-compose up -d` to start, `docker-compose stop`
   to stop and `docker-compose pull` to update.

If you want to set it up in an existing docker-compose file instead of a new
dedicated one, simply adjust the `volumes` section to mount a subdirectory
instead of the current directory as the data directory:

```yaml
volumes:
- ./meowlnir:/data
```

When you put Meowlnir and Synapse in the same docker-compose file, networking
should work out of the box, which means you don't need any of the commented
`ports` or `networks` things in the example compose file.
