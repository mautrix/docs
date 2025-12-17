# HTTP API

`_gomuks/auth` is used to acquire or refresh cookies. If an existing
`gomuks_auth` cookie is provided, it's validity is extended. Otherwise, basic
auth credentials will be checked.

Available query parameters:

* `output` - can be `json` (JSON in response body) or omitted (`Set-Cookie` header)
* `no_prompt` - if set to `true`, the `WWW-Authenticate` header will not be set
  when credentials are missing or invalid.
* `insecure_cookie` - if set to `true`, the cookie will not have the `Secure`
  flag set.

TODO other endpoints
