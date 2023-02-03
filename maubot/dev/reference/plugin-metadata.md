# Plugin metadata
The `maubot.yaml` file can contain the following fields:

* `maubot` - The minimum version of maubot that the plugin requires.
  Currently only v0.1.0 exists, so the field doesn't do anything yet.
* `id` - An unique identifier for the plugin. It should follow Java package
  naming conventions (use your own domain, not `xyz.maubot`).
* `version` - The version of the plugin in PEP 440 format.
* `license` - The [SPDX license identifier](https://spdx.org/licenses/) for the
  plugin. Optional, assumes all rights reserved if omitted.
* `modules` - A list of Python modules that the plugin includes.
  * Python modules are either directories with an `__init__.py` file, or simply
    Python files.
  * Submodules that are imported by modules listed here don't need to be listed
    separately. However, top-level modules must always be listed even if they're
    imported by other modules.
  * **Currently module names must be globally unique.**
* `main_class` - The main class of the plugin as `module/ClassName`.
  * If `module/` is omitted, maubot will look for the class in the *last* module
    specified in the `modules` list.
  * Even if the module is not omitted, it must still be listed in the `modules`
    array.
* `extra_files` - An instruction for the `mbc build` command to bundle
  additional files in the `.mbp` file. Used for things like example configs.
* `dependencies` - A list of Python modules and their version ranges that the
  plugin requires. This is currently not used, but in the future maubot will
  offer to automatically install dependencies when uploading a plugin.
  * This should not include any standard packages that maubot requires, only
    custom requirements should be listed. It's also recommended to specify
    version ranges (e.g. based on semver), not exact versions.
* `soft_dependencies` - Same as `dependencies`, but not required for the plugin
  to function.
* `config` - Whether the plugin has a [configuration]
* `webapp` - Whether the plugin registers [custom HTTP handlers]
* `database` - Whether the plugin has a [database]

[configuration]: ../configuration.md
[custom HTTP handlers]: ../handlers/web.md
[database]: <> (../database.md)
