# Customizing keybindings
Keybindings can be customized to some extent by creating a file called
`keybindings.yaml` in the config directory (see the [FAQ] for the location of
the config directory).

The file should have the same format as the [default keybindings.yaml] file,
but you only need to specify the bindings you want to override.

[FAQ]: https://docs.mau.fi/gomuks/faq.html#system-specific-defaults
[default keybindings.yaml]: https://github.com/tulir/gomuks/blob/master/config/keybindings.yaml

For example, to use enter for newline, you'd want something like this. Note
that terminals can't detect shift+enter, and usually only either ctrl or alt
works.

```yaml
main:
  'Enter': add_newline
  'Ctrl+Enter': unbind
  'Alt+Enter': unbind

room:
  'Enter': unbind
  'Ctrl+Enter': send
  'Alt+Enter': send
```
