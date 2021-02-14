# Bridge setup with systemd

{{ #include ../selector.html }}

1. Create a user for the bridge:
   ```shell
   $ sudo adduser --system mautrix-$bridge --home /opt/mautrix-$bridge
   ```
2. Set up the bridge with the [normal virtualenv setup](./index.md). Make sure
   you use that user and home directory for the bridge.
3. Create a systemd service file at `/etc/systemd/system/mautrix-$bridge.service`:
   ```ini
   [Unit]
   Description=mautrix-$bridge bridge

   [Service]
   WorkingDirectory=~
   ExecStart=/opt/mautrix-$bridge/bin/python -m mautrix_$bridge
   User=mautrix-$bridge

   [Install]
   WantedBy=multi-user.target
   ```
