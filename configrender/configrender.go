package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/alecthomas/chroma/v2"
	"github.com/alecthomas/chroma/v2/lexers"
	"github.com/alecthomas/chroma/v2/styles"
	"go.mau.fi/util/exerrors"

	"go.mau.fi/docs/configrender/html"
)

const cssTemplate = `
body {
  margin: 0;
  padding: 0;
}
.chroma {
  padding: 8px 0;
  margin: 0;
}
.chroma a.name-link {
  text-decoration: none;
}
@media (prefers-color-scheme: light) {
  %[1]s
  .chroma .line:target, .chroma .name-link:target {
    scroll-margin-top: 20vh;
    %[2]s
  }
}
@media (prefers-color-scheme: dark) {
  %[3]s
  .chroma .line:target, .chroma .name-link:target {
	scroll-margin-top: 20vh;
	%[4]s
  }
}
`

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>%[1]s</title>
  <style>
  %[2]s
  </style>
</head>
<body>
  %[3]s
</body>
</html>
`

func main() {
	hfmt := html.New()

	var buf strings.Builder
	gh := styles.Get("github")
	exerrors.PanicIfNotNil(hfmt.WriteCSS(&buf, gh))
	ghCSS := buf.String()
	buf.Reset()
	ghDark := styles.Get("github-dark")
	exerrors.PanicIfNotNil(hfmt.WriteCSS(&buf, ghDark))
	ghDarkCSS := buf.String()
	buf.Reset()
	fullCSS := fmt.Sprintf(
		cssTemplate,
		ghCSS, html.StyleEntryToCSS(gh.Get(chroma.LineHighlight)),
		ghDarkCSS, html.StyleEntryToCSS(ghDark.Get(chroma.LineHighlight)),
	)

	input := exerrors.Must(os.ReadFile(os.Args[1]))
	iter := exerrors.Must(lexers.Get("yaml").Tokenise(nil, string(input)))
	exerrors.PanicIfNotNil(hfmt.Format(&buf, styles.Fallback, iter))
	exerrors.PanicIfNotNil(os.WriteFile(os.Args[2], []byte(fmt.Sprintf(
		htmlTemplate,
		os.Args[1],
		fullCSS,
		buf.String(),
	)), 0644))
}
