# Debugging
If something doesn't work but it doesn't crash, check the
`/tmp/gomuks/debug.log` file for any errors. You can override the location of
this file with the `DEBUG_DIR` environment variable.

### Developing
Set `DEBUG=1` to enable partial deadlock detection and to write panics to stdout
instead of a file.

To build and run with [race detection], use `go install -race` and set
`GORACE='history_size=7 log_path=/tmp/gomuks/race.log'` when starting gomuks,
then check `/tmp/gomuks/race.log.<pid>`. Note that race detection will use a lot
of extra resources.

[race detection]: https://golang.org/doc/articles/race_detector.html

Proper debuggers are too fancy, but normal prints won't work in a TUI
application. To write to the debug log mentioned previously, use the
`maunium.net/go/gomuks/debug` package:

```go
package foo

import (
	"maunium.net/go/gomuks/debug"
)

func Foo() {
	debug.Print("WHY ISN'T IT WORKING?!?!?")
	debug.PrintStack()
}
```
