# Reverse proxying
The maubot management interface has a log viewer which uses a websocket to get
real-time logs from the backend. If you're using a reverse proxy (as you should)
in most cases, you probably need to configure it to allow websockets for the
`/_matrix/maubot/v1/logs` endpoint.

## Caddy
Caddy 2 supports websockets out of the box with no additional configuration.

```Caddyfile
example.com {
    reverse_proxy /_matrix/maubot http://localhost:29316
}
```

## Nginx
```nginx
server {
    listen 443 ssl;
    ...
    location /_matrix/maubot/v1/logs {
        proxy_pass http://localhost:29316;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header X-Forwarded-For $remote_addr;
    }

    location /_matrix/maubot {
        proxy_pass http://localhost:29316;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
    ...
}
```
