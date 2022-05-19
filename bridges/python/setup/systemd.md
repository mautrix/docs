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
   # N.B. If you didn't create a user with the correct home directory, set this
   #      to the directory where config.yaml is (e.g. /opt/mautrix-$bridge).
   WorkingDirectory=~
   ExecStart=/opt/mautrix-$bridge/bin/python -m mautrix_$bridge
   User=mautrix-$bridge

   # Hardening
   CapabilityBoundingSet = [ "" ];
   LockPersonality = true;
   PrivateTmp = true;
   ProcSubset = "pid";
   ProtectClock = true;
   ProtectControlGroups = true;
   ProtectHome = true;
   ProtectHostname = true;
   ProtectKernelLogs = true;
   ProtectKernelModules = true;
   ProtectKernelTunables = true;
   ProtectProc = "invisible";
   ProtectSystem = "strict";
   RestrictNamespaces = true;
   RestrictRealtime = true;
   RestrictSUIDSGID = true;
   SystemCallArchitectures = "native";

   [Install]
   WantedBy=multi-user.target
   ```
