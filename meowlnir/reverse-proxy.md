# Reverse proxy configuration

Meowlnir can handle the following endpoints:

* `/_meowlnir/*` for internal Meowlnir API. Doesn't need to be exposed publicly
  yet, as there's no web interface.
  * Synapse needs to be able to reach `/_meowlnir/antispam/*`
    if using [invite blocking](./invite-blocking.md).
* The standard `/_matrix/app/*` endpoints used by appservices.
  Only your homeserver needs to be able to reach them.
* `/_matrix/policy/unstable/org.matrix.msc4284/event/{eventID}/check`
  (or just `/_matrix/policy/*`) if using Meowlnir as a policy server ([MSC4284]).
* Reporting endpoints for [report interception](./report-interception.md):
  * `/_matrix/client/v3/rooms/{roomID}/report`
  * `/_matrix/client/v3/rooms/{roomID}/report/{eventID}`
  * `/_matrix/client/v3/users/{userID}/report`

[MSC4284]: https://github.com/matrix-org/matrix-spec-proposals/pull/4284

## Example configurations

### Caddy
```Caddyfile
matrix-client.example.com {
    @reporting {
        path /_matrix/client/v3/rooms/*/report/* /_matrix/client/v3/rooms/*/report /_matrix/client/v3/users/*/report
    }
    handle @reporting {
        reverse_proxy http://localhost:29339
    }
}

matrix-federation.example.com {
    handle /_matrix/policy/* {
        reverse_proxy http://localhost:29339
    }
}
```
