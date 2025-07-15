# Bridge setup with Docker

{{ #include ../selector.html }}

This page contains instructions for setting up the bridge in Docker. To set up
the bridge outside of Docker, see the language-specific instructions:
[Python](../python/setup.md), [Go](../go/setup.md)
(to find out which bridge language the bridge you want is written in, check
the sidebar to see which section it's under).

If you need help with setting up the bridge, you can ask in the Matrix room:
[#$bridge:maunium.net](https://matrix.to/#/#$bridge:maunium.net). For help with
setting up other parts like the homeserver that aren't the bridge, refer to
their documentation to find support rooms.

<p class="bridge-filter" bridges="gvoice" bridge-no-generic style="display: none">
  <strong>Sending messages to Google Voice with non-workspace accounts requires Electron,
  which is not available in the Docker image. Bare-metal installs are recommended.</strong>
</p>

## Requirements
* Docker
* A Matrix homeserver that supports application services (e.g. [Synapse](https://github.com/element-hq/synapse))
  You need access to register an appservice, which usually involves editing the homeserver config file.
* <span class="bridge-filter" bridges="whatsapp">**mautrix-whatsapp**: </span>
  A WhatsApp client running on a phone or in an emulated Android VM.
* <span class="bridge-filter" bridges="signal">**mautrix-signal**: </span>
  A Signal client that can add linked devices (both official mobile apps and
  some unofficial clients like signal-cli work).

## Setup
Docker images are hosted on dock.mau.dev. Available docker tags are generally
`:latest`, `:git tag`, `:git commit-amd64` and `:git commit-arm64`. The latest
and git tag specific docker tags are manifests that contain both amd64 and
arm64 images. `:latest` points at the latest commit, not the latest release.

0. Create a directory for the bridge and cd into it: `mkdir mautrix-$bridge && cd mautrix-$bridge`.  
   **N.B.** The docker image will `chown` its `/data` directory to UID 1337.
   The commands below mount the working directory as `/data`, so make sure you
   always run them in the correct directory.
1. Pull the docker image with `docker pull dock.mau.dev/mautrix/$bridge:<version>`.
   Replace `<version>` with the version you want to run (e.g. `latest` or `v0.6.0`).
2. Run the container for the first time, so it can create a config file for you:
   ```
   docker run --rm -v `pwd`:/data:z dock.mau.dev/mautrix/$bridge:<version>
   ```
3. Update the config to your liking. See the [initial bridge config](../general/initial-config.md)
   page for recommendations.
   * Keep in mind that `localhost` is not the correct address inside Docker
     (unless using `network=host` mode). Usually you should have the bridge and
     homeserver in the same Docker network, and use the container names as
     addresses (e.g. `http://mautrix-$bridge:$bridgeport` and `http://synapse:8008`).
    * Make sure you don't share databases between unrelated programs.
      Shared postgres instance is fine, but shared database is not.
4. Generate the appservice registration by running the container again, same
   command as above.
5. Register the bridge on your homeserver (see [Registering appservices]).
6. Run the bridge:
   ```
   docker run --restart unless-stopped -v `pwd`:/data:z dock.mau.dev/mautrix/$bridge:<version>
   ```
   Additionally, you should either add the bridge to the same Docker network as
   Synapse with `--network=synapsenet` (when both are running in Docker), or
   expose the correct port with `-p $bridgeport:$bridgeport` (when the
   homeserver is outside Docker).

[Registering appservices]: ./registering-appservices.md

## Upgrading
1. Pull the new version (setup step 1)
2. Start the new version (setup step 6)

## Docker compose
0. Create a directory for the bridge like step #0 in the Docker CLI
   instructions above.
1. Create `docker-compose.yml` that contains something like this:
   ```yaml
   version: "3.7"

   services:
     mautrix-$bridge:
       container_name: mautrix-$bridge
       image: dock.mau.dev/mautrix/$bridge:<version>
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
       #- "$bridgeport:$bridgeport"
       # You'll also probably want this so the bridge can reach Synapse directly
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
- ./mautrix-$bridge:/data
```

When you put the bridge and Synapse in the same docker-compose file, networking
should work out of the box, which means you don't need any of the commented
`ports` or `networks` things in the example compose file.

## Kubernetes
Kubernetes setups aren't officially supported. However, there are some things
you should note if you want to run the bridges in k8s or similar systems:

* You can bypass the startup script and just run the main bridge command
  directly to avoid permission mangling, automatic registration generation,
  and other such things. The bridge also doesn't need the registration file at
  all when doing this, only the config file is needed.
  * You can also add `--no-update` to the command to tell the bridge to not try
    to write the config to disk. When preventing writing the config, make sure
    you don't leave any `generate` values in the config, as otherwise they'll
    be randomized on every startup and will cause unexpected behavior.
* A `StatefulSet` is likely the best way to run the bridge, because only one
  container can be running at a time. Multiple containers even briefly are
  extremely unsupported and may cause your server to explode.
* You should set `publishNotReadyAddresses: true`. The bridges will check
  homeserver -> bridge connectivity on startup, which may fail or be delayed if
  k8s delays publishing the bridge address. There is also no reason to not
  publish addresses ASAP, because you can only have one instance of the bridge
  running at a time.
* Liveness and readiness endpoints are available at `/_matrix/mau/live` and
  `/_matrix/mau/ready` respectively, but they aren't particularly useful due to
  the points mentioned above.
