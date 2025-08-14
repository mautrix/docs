# Configuring Meowlnir
Like bridges, the example config can be generated with `./meowlnir -e`.
Alternatively, you can find it in the repository in [./config/example-config.yaml].

[./config/example-config.yaml]: https://github.com/maunium/meowlnir/blob/main/config/example-config.yaml

Most of the config is self-documenting via comments. After filling out the config,
refer to the appservice registration section below.

Meowlnir requires its own database (both SQLite and Postgres are supported), and
can use read-only access to the Synapse database for optional features and
performance improvements.

## Notes on Synapse database access
A read-only user can be created with something like this:

```sql
CREATE USER meowlnir WITH PASSWORD '...';
GRANT CONNECT ON DATABASE synapse TO meowlnir;
GRANT USAGE ON SCHEMA public TO meowlnir;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO meowlnir;
```

The current primary reason Meowlnir reads the database directly is to get
events to redact more efficiently, and to find soft-failed events (which
may not have soft-failed on other servers).

To make finding events more efficient, you may want to add an index:

```sql
CREATE INDEX meowlnir_event_sender_idx ON events (room_id, sender);
```

## Appservice registration
After configuring Meowlnir itself, make a registration file, such as this:

```yaml
# ID and tokens must be exactly the same as in the Meowlnir config.
id: ...
as_token: ...
hs_token: ...
# The URL where the homeserver can reach Meowlnir.
url: http://localhost:29339
# This doesn't matter, just needs to be unique.
sender_localpart: any random string here
# Meowlnir will not handle ratelimits, so this must be false.
rate_limited: false
# Meowlnir uses MSC3202, MSC4190 and MSC4203 for encryption,
# so they must be enabled if you want encryption support.
org.matrix.msc3202: true
io.element.msc4190: true
# push_ephemeral is the old name of receive_ephemeral, as Synapse hasn't stabilized MSC2409 support yet.
# Enabling 2409/receive_ephemeral is required for MSC4203, but is not otherwise used by Meowlnir.
de.sorunome.msc2409.push_ephemeral: true
receive_ephemeral: true
# Add the bots you want here. If you only want one bot, a static regex is enough.
# Multiple bots are supported too and can be dynamically added if you set a non-static regex (e.g. `@moderation_.+:example\.com`)
namespaces:
  users:
  - regex: '@abuse:example\.com'
    exclusive: true
```

Additionally, you'll need to enable some experimental features in the Synapse
config if using encryption:

```yaml
experimental_features:
  # Actually MSC4203, but it was previously a part of MSC2409
  msc2409_to_device_messages_enabled: true
  # MSC3202 has two parts, both need to be enabled
  msc3202_device_masquerading: true
  msc3202_transaction_extensions: true
```

If you use a homeserver without MSC4203/MSC3202 support, or don't want to enable
them in Synapse, you can use Meowlnir without them by disabling encryption
support entirely in the Meowlnir config.

After you have the registration file, register it with your homeserver like any
other appservice. You can refer to the [Registering appservices] page in bridge
docs for details.

[Registering appservices]: https://docs.mau.fi/bridges/general/registering-appservices.html

## Running on a non-Synapse server
While Meowlnir is designed to be used with Synapse, it can be used with other
server implementations as well.

If your server doesn't support all the MSCs mentioned in the appservice
registration section, set `encryption` -> `enable` to `false` to disable
encryption entirely. The `experimental_features` mentioned above as well as
the unstable prefixed registration fields aren't necessary when encryption
is disabled.

The Synapse database connection can be skipped by leaving `type` and `uri`
blank in the config. Note that unless your homeserver implements [MSC4194],
redacting messages from banned users will use a much slower approach of
paginating all messages in the room from the past 24 hours to find messages to
redact.

[MSC4194]: https://github.com/matrix-org/matrix-spec-proposals/pull/4194

You can technically point Meowlnir at another server's Synapse database too; it
doesn't have to be the database of the server the bot is connected to. If doing
that, ensure that the target Synapse is in all the protected rooms so that it
receives all events that may need to be redacted in the future.
