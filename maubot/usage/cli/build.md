# mbc build

The `mbc build` command zips plugin files into a `.mbp` file that can be
uploaded to the maubot server.

The simplest way to use it is to run `mbc build` in the directory that contains
`maubot.yaml`, and it will output the matching `.mbp` file in the same
directory.

There are also some other options available:

* `mbc build <directory>` to build the plugin from a different directory.
* `mbc build -o <path>` to output the `.mbp` file to a different location.
* `mbc build -u` to upload the plugin directly to a server instead of saving it
  to a local file.

The `-u`/`--upload` flag is especially useful when developing plugins, as the
server will reload all instances so you can test the changes immediately.
