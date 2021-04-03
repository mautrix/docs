# Setup with Docker
Docker images are hosted on [dock.mau.dev](https://mau.dev/maubot/maubot/container_registry)

0. Create a directory (`mkdir maubot`) and enter it (`cd maubot`).
1. Pull the docker image with `docker pull dock.mau.dev/maubot/maubot:<version>`.
   Replace `<version>` with the version you want to run (e.g. `latest`)
2. Run the container for the first time, so it can create a config file for you:
   ```
   docker run --rm -v $PWD:/data:z dock.mau.dev/maubot/maubot:<version>
   ```
3. Update the config to your liking.
4. Run maubot:
   ```
   docker run --restart unless-stopped -p 29316:29316 -v $PWD:/data:z dock.mau.dev/maubot/maubot:<version>
   ```
5. The management interface should now be available at
   <http://localhost:29316/_matrix/maubot> or whatever you configured.

### Upgrading
1. Pull the new version (setup step 1).
2. Restart the container.
