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

## Versioning
Most software following the release schedule also uses [calendar versioning],
which was first announced with the [October 2025 releases].

The format is `vYY.0M.patch`, but due to restrictions from Go modules, the
actual git tags follow [0ver](https://0ver.org/) and are formatted as
`v0.YY0M.patch` instead. Docker tags are available in both formats.

For example, the August 2026 releases had `v26.08` as their version and
`v0.2608.0` as the git tags. Patch releases are very uncommon, but if one
happened, it would be `v26.08.1` and `v0.2608.1` respectively.

mautrix-go and go-util do not use calver, they are still semver/0ver where the
major version is always zero, minor version gets bumped for bigger changes and
patch version gets bumped by default.

[calendar versioning]: https://calver.org/
[October 2025 releases]: https://mau.fi/blog/2025-10-mautrix-release/
