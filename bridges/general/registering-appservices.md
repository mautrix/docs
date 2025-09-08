# Registering appservices
All the bridges here use the Matrix [Application Service API]. It's mostly the
same as the client-server API, but there are a few key differences. Primarily,
it means that the bridges

* can control any user ID in a predefined namespace, e.g. all user IDs starting
  with `@telegram_` and ending with `:yourserver.com`,
* don't have rate limits, and
* have events pushed to them via HTTP, instead of pulling with long polling
  like normal Matrix clients do.

To get these special privileges, the bridge must be registered on the
homeserver as an appservice. In general, this requires root access to the
server. Instructions for individual homeserver implementations can be found
below.

All of the instructions below require you to have the `registration.yaml` file
ready, so make sure you've reached the point in the bridge setup instructions
where it tells you to register the bridge on your homeserver.

The registration file is only necessary for the homeserver. None of the mautrix
bridges will try to read it at runtime, as all the relevant information is also
in the bridge-specific config file. However, this also means that if you change
certain config fields, you must regenerate the registration file (or manually
apply the relevant changes). The config fields that affect the registration are:

* `homeserver` -> `domain`
* `appservice` -> `address`
* `appservice` -> `bot_username` (or `bot` -> `username` in Go bridges)
* `appservice` -> `ephemeral_events`
* `appservice` -> `id`
* `appservice` -> `as_token`
* `appservice` -> `hs_token`
* `bridge` -> `username_template`
* `bridge` -> `alias_template` (Telegram only)

[Application Service API]: https://spec.matrix.org/v1.15/application-service-api/

## Synapse
If necessary, copy the registration file somewhere where Synapse can read it.
Then add the path to the file under [`app_service_config_files`] in Synapse's
`homeserver.yaml` file. The field must be an array of strings, for example:

```yaml
app_service_config_files:
- /data/mautrix-telegram-registration.yaml
```

After updating the config, restart Synapse to apply changes. If you change or
regenerate the registration file, you will need to restart Synapse every time.

If Synapse fails to start after editing the config, it means you either made a
YAML syntax error, or the file path is incorrect or not readable. See the
Synapse logs to find out what went wrong exactly.

Some things to keep in mind:

* When using Docker, the file needs to be mounted inside the container
* If Synapse is running through systemd, the service file might have security
  hardening features that block access to certain paths.

[`app_service_config_files`]: https://element-hq.github.io/synapse/v1.138/usage/configuration/config_documentation.html#app_service_config_files

## Beeper
Follow the instructions at [github.com/beeper/bridge-manager](https://github.com/beeper/bridge-manager).

## Dendrite
**N.B.** Dendrite is not a supported environment, as it often has serious bugs.
It is strongly recommended to use Synapse instead. Conduit-based servers like
continuwuity are also fine.

Dendrite works the same way as Synapse, except the relevant config field is
[`config_files` under `app_service_api`](https://github.com/element-hq/dendrite/blob/v0.15.2/dendrite-sample.yaml#L164-L166)
(and the config file is usually called `dendrite.yaml` rather than `homeserver.yaml`):

```yaml
app_service_api:
    ...
    config_files:
    - /data/mautrix-telegram-registration.yaml
```

## Conduit
Also applies to Conduit-based servers such as continuwuity

Conduit doesn't use a config file, instead it has an admin command for
registering appservices. Go to the admin room (which is created automatically
when the first user is registered on the server), copy the contents of the
registration YAML file, then send a `register_appservice` command:

~~~
@conduit:your.server.name: register_appservice
```
paste registration.yaml contents here
```
~~~

(replacing `your.server.name` with the server name. You can also use tab
autocompletion to mention the `@conduit` user in most clients).

You can confirm it worked using the `list_appservices` command (which should
show the `id` field of the just registered appservice):

```
@conduit:your.server.name: list_appservices
```

See also: <https://gitlab.com/famedly/conduit/-/blob/next/APPSERVICES.md>
