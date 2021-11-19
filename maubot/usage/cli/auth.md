# mbc auth

The `mbc auth` command can be used to log into Matrix accounts.

To log in with `mbc auth`, first make sure you have your homeserver listed in
the `homeservers` section in the maubot config (the secret can be empty). If you
haven't used the `mbc` tool before, log into your maubot instance  with
`mbc login`. Finally, run `mbc auth` and fill in the parameters:

* The homeserver is the dictionary key, i.e. server name (not URL) from
  the `homeservers` config.
* The username can be either the username or full user ID, that doesn't matter.
* The password is the password.

If the command says "Registration target server not found", it means you didn't
add the server to `homeservers` properly or didn't enter the correct name in
`mbc`.

If you want to register the account, you must pass `--register` as a parameter.

Additionally, there's a `--update-client` parameter that tells maubot to store
the created access token as a client instance so you don't have to do it
manually in the web interface.
