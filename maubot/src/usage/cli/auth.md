# mbc auth
The `mbc auth` command can be used to log into Matrix accounts.
It also has a `--register` flag, but that's currently broken.

To log in with `mbc auth`, first make sure you have your homeserver listed in
the `registration_secrets` section in the maubot config (the secret can be
empty). If you haven't used the `mbc` tool before, log into your maubot instance
with `mbc login`.  Finally, run `mbc auth` and fill in the parameters:

* The homeserver is the *key* (not URL) from the `registration_secrets` config.
* The username can be either the username or full user ID, that doesn't matter.
* The password is the password.

If the command says "Registration target server not found", it means you didn't
add the server to `registration_secrets` properly or didn't enter the correct
name in `mbc`.

Finally, use the generated access token to create or update your client in the
management web interface.
