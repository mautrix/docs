# WhatsApp bridge setup with systemd
1. Create a user for the bridge:
   ```shell
   $ sudo adduser --system mautrix-whatsapp --home /opt/mautrix-whatsapp
   ```
2. Set up the bridge with the [normal setup](./index.md). Make sure you use that
   user and home directory for the bridge.
3. Create a systemd service file at `/etc/systemd/system/mautrix-whatsapp.service`:
   ```ini
   [Unit]
   Description=mautrix-whatsapp bridge
   
   [Service]
   Type=exec
   User=mautrix-whatsapp
   WorkingDirectory=/opt/mautrix-whatsapp
   ExecStart=/opt/mautrix-whatsapp/mautrix-whatsapp
   Restart=on-failure
   RestartSec=30s
   
   # Optional hardening to improve security
   ReadWritePaths=/opt/mautrix-whatsapp
   NoNewPrivileges=yes
   MemoryDenyWriteExecute=true
   PrivateDevices=yes
   PrivateTmp=yes
   ProtectHome=yes
   ProtectSystem=strict
   ProtectControlGroups=true
   RestrictSUIDSGID=true
   RestrictRealtime=true
   LockPersonality=true
   ProtectKernelLogs=true
   ProtectKernelTunables=true
   ProtectHostname=true
   ProtectKernelModules=true
   PrivateUsers=true
   ProtectClock=true
   SystemCallArchitectures=native
   SystemCallErrorNumber=EPERM
   SystemCallFilter=@system-service
   
   [Install]
   WantedBy=multi-user.target
   ```
