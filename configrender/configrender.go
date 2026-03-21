package main

import (
	"fmt"
	"os"
	"path"
	"slices"
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
  padding: 8px 0 80px;
  margin: 0;
}
.chroma a.name-link {
  text-decoration: none;
}
p {
  margin: 8px 8px 0;
}
@media (prefers-color-scheme: light) {
  %[1]s
  .chroma .line:target, .chroma .name-link:target {
    scroll-margin-top: 20vh;
    %[2]s
  }
  body {
	%[3]s
  }
  body > p > a {
    color: #0a3069;
  }
}
@media (prefers-color-scheme: dark) {
  %[4]s
  .chroma .line:target, .chroma .name-link:target {
	scroll-margin-top: 20vh;
	%[5]s
  }
  body {
	%[6]s
  }
  body > p > a {
    color: #a5d6ff;
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
  %[4]s
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
		ghCSS,
		html.StyleEntryToCSS(gh.Get(chroma.LineHighlight)),
		html.StyleEntryToCSS(gh.Get(chroma.Background)),
		ghDarkCSS,
		html.StyleEntryToCSS(ghDark.Get(chroma.LineHighlight)),
		html.StyleEntryToCSS(ghDark.Get(chroma.Background)),
	)

	inputFile := os.Args[1]
	outputFile := strings.Replace(inputFile, ".yaml", ".html", 1)
	fmt.Println("Rendering", inputFile, "into", outputFile)
	input := exerrors.Must(os.ReadFile(inputFile))
	iter := exerrors.Must(lexers.Get("yaml").Tokenise(nil, string(input)))
	exerrors.PanicIfNotNil(hfmt.Format(&buf, styles.Fallback, iter))
	var releases string
	if strings.HasSuffix(inputFile, "latest.yaml") {
		var releaseList []string
		dirName := path.Dir(inputFile)
		for _, file := range exerrors.Must(os.ReadDir(dirName)) {
			name := file.Name()
			if strings.HasPrefix(name, "v") && strings.HasSuffix(name, ".yaml") {
				releaseList = append(releaseList, fmt.Sprintf(`<a href="%[1]s.html">%[1]s</a>`, strings.TrimSuffix(name, ".yaml")))
			}
		}
		slices.Sort(releaseList)
		slices.Reverse(releaseList)
		releases = fmt.Sprintf(`<p>Releases: %s</p>`, strings.Join(releaseList, ", "))
	}
	exerrors.PanicIfNotNil(os.WriteFile(outputFile, []byte(fmt.Sprintf(
		htmlTemplate,
		inputFile,
		fullCSS,
		releases,
		buf.String(),
	)), 0644))
}
