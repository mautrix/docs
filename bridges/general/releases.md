# Release schedule
When software is being actively developed, releases are effectively always
outdated. The main branch is generally stable and safe to use in production,
although automatic unattended upgrades are not recommended. The CI builds
binaries and docker images for every commit, so you don't need to compile
yourself to use the main branch (see the setup docs for details). Bugs should
only be reported on the main branch.

The standard release day is the 16th of each month. New releases may be skipped
if there's something blocking the release, or if nothing relevant has changed
since the last release. Releases outside the standard cycle only happen if there
are severe security issues that must be fixed immediately, or if there's a major
breaking change externally that breaks the latest release completely.

Scheduled releases are accompanied by a blog post on [mau.blog](https://mau.blog)
with the list of releases and highlights of the changes.

Anything older than the latest release is completely unsupported and there
won't be any patches even for security issues.

The standard release cycle applies to:

* all mautrix bridges
* mautrix-go and go-util
* Meowlnir
* gomuks

All other projects do not have a release cycle and will be released at random.
This includes:

* mautrix-python
* maubot and official plugins
* whatsmeow
