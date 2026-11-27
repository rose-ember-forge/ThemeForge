# Shebang

Shebang is a terminal theme. Every slide is set in a monospace font. The frame titles outputs for a prompt command. The footer is designed as a status bar. 

```latex
\documentclass[11pt, aspectiratio=169]{beamer}
\usetheme{Shebang}
```

Version 0.1 (November 2026). Works with pdfLaTeX, XeLaTeX, and LuaLaTeX.



## Fonts

Shebang, like all themes in ThemeForge, uses fonts available on TeX Live:

| Font          | Used for | Package |
| ------------- | -------- | ------- |
| IBM Plex Mono | all text | plex    |
| newtxmath     | maths    | newtx   |

A full TeX Live installation will have these. So will OVerleaf. In case your machine doesn't have them the fix is easy:

```sh
tlmgr install plex newtx
```

MiKTeX installs them by itself the first time you compile.

If a font is missing, the compile process will go ahead, using default fonts as fallback. There will be warnings about it in the log.



## Options

Options go in square brackets before the theme name:

```latex
\usetheme[variant=light, progressbar=false]{Shebang}
```

| Option        | Values                     | Default          | What it does                                                                |
| ------------- | -------------------------- | ---------------- | --------------------------------------------------------------------------- |
| `variant`     | `env`, `light`, `dark`     | `env`            | Colour scheme                                                               |
| `accent`      | Hex codes, without the `#` | variant's accent | Replaces only the accent colour                                             |
| `progressbar` | `true`/`false`             | `true`           | The `[###.......]` bar in the status bar. The frame counter stays.          |
| `sectionpage` | `true`/`false`             | `true`           | A divider slide at every `\section`                                         |
| `fonts`       | `true`/`false`             | `true`           | Loads Plex Mono and newtxmath. Set 'false' to use fonts of your own choice. |

Shebang supports all four core options of ThemeForge (`variant`, `accent`, `progressbar`, and `sectionpage`), so a deck written for Meridian or Fabrica compiles with the same options. The only thing to do it  change the theme name to Shebang: `\usetheme{Shebang}`



## Variants

| `variant = ` | Look                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------- |
| `env`        | Nigh-black page with a teal accent. Inspired by a modern editor's dark mode. This is the default. |
| `light`      | Pale green page with a deep green accent. Like a terminal set to a light profile.                 |
| `dark`       | Deep green page with bright phosphor-green accent. The classic green terminal.                    |

A variant name unknown to Shebang gives a warning and falls back to `env`:

```
Package beamerthemeShebang Warning: Unknown variant 'drak', using 'env'. Choose light, dark, or env.
```

## Choosing an accent

The accent colours the prompt `$`, the cursor, the first-level bullets, the name box in the status bar and the background of the standout slide. It is used as text on the page, so it needs enough contrast:

- On `env` and `dark`, choose a light or bright accent.

- On `light`, choose a dark or saturated accent

My suggestions are:

| For `env` and `dark` | For `light`     |
| -------------------- | --------------- |
| `FFB000` amber       | `0A5C9E` cobalt |
| `58A6FF` blue        | `7A2E8E` plum   |
| `D2A8FF` lavender    | `A33B00` rust   |

Usage example:

```latex
\usetheme[variant = light, accent = 7A2E8E]{Shebang}
```

In the interest of readability, Shebang measures the contrast provided by the accent when it compiles. The baseline for comparison is set by guidelines of WCAG. The log will say it if there the contrast is too low:

```
Package beamerthemeShebang Warning: accent=FFD54F is faint as text on this variant's background (1.4:1, WCAG needs 4.5:1).
```

The compile process is not stopped because of this. The text drawn on the accent colour  switches between dark and light by itself, to whichever reads better. You can try colours on [Shebang's theme page](https://rose-ember-forge.github.io/ThemeForge/themes/Shebang/), where the squares beside the live slide show the contrast as you pick.



## What each part looks like

### Title page

```
$ head -n 2 talk.tex
Modern Slides with Beamer
A tour of the Shebang theme

$ whoami
Rosario Corazon @ ThemeForge

$ date
1 January, 2026

$ █
```

The title page laid out like a short terminal session. It "prints the top of your file" (the title and the subtitle), then runs `whoami`, which shows the `\author` and `\institute`. The command `date` then outputs `\date`. Leaving out any of them takes out that command from the title page. In case you don't have a subtitle, the first command shows `head -n 1`.



Use `[plain, noframenumbering]`  on the title slide to hide the footer and keep it from being counted in the frame numbers:

```latex
\begin{frame}[plain, noframenumbering]
    \titlepage
\end{frame}
```

### The file name on the title page

Shebang fills in the file name by default, from LaTeX's job name. That is usually the name of your source file. If the name has spaces in it, it shows up enclosed in single quotes, the same way a shell would need it.



There are exceptions:

- Overleaf compiles every project under the job name `output`, so the title page would read `head -n 2 output.tex`. This is what you'll see if you open Shebang as a project using the `Open in Overleaf` button form the theme page.

- A build script or a compile process from an editor that passes `-jobname=. . .` shows that name. My own build script does this, which is why the screenshots would read something like `demo-Shebang-env.tex`.



For the reasons mentioned above, Shebang offers a way to input a custom file name. Use `\shebangfile` in your preamble:

```latex
\usetheme{Shebang}
\shebangfile{talk.tex}
```

The `\shebangfile` command does not add a file extension or quotes, so write exactly what you want the name to look like. Anything goes, for example: `\shebangfile{slides/chapter-1.tex}`.



### Frame titles

```latex
\begin{frame}{frame title}{Optional subtitle}
```

```sh
~/02-compoenents $
Frame title █
# Optional subtitle
```

Above each title is a small prompt with the current "directory", built from the section: `\section{Components}`, the second section, becomes `~/02-components`. Before the first section it is `~`, and after `\appendix` it is `~/appendix`. The subtitle is written as a `#` comment.



### Status  bar

The footer is  status bar, like the one in a terminal editor:

```
Short author    Short title | Components    [###...]    5/12
```

From left to right: the author's name in an accent-coloured box, the short title and the current section. the progress bar, and the frame count. The bar and the section part use the short forms, so provide the short versions in your source file:

```latex
\title[New Beamer]{Modern slides with Beamer}
\author[Rose C.]{Rosario Corazon}
```

With `progressbar=false`, only the frame numbering (`5/12`)  reamin on the right. After `\appendix`, the section part reads `Appendix`. Load the package `appendixnumberbeamer` so backup slides don't count towards the total.

### Sections and the table of contents

Every `\section{...}` adds a divider slide:

```sh
$ cd ~/02-components
Components █
```

Divider slides have no status bar and aren't counted towards the total. You can turn them off with `sectionpage=false`.



`\tableofcontents` is drawn as a directory listing:

```
$ ls 
01-typography/
02-components/
```

`\tableofcontents[currentsection]` dims the other sections, as usual.



### Lists

  

| Level | `itemize`     | `enumerate`     |
| ----- | ------------- | --------------- |
| 1     | `>` accent    | `[1]` accent    |
| 2     | `-` highlight | `[a]` highlight |
| 3     | `*` muted     | `[i]` muted     |

The second and third levels are set slightly smaller. 



### Blocks

Blocks are drawn as boxes with the title cut into the top line:

```
┌─ Definition ─────────────┐     
│ ...                      │   
└──────────────────────────┘
┌─ error: Watch out ───────┐   
│ ...                      │
└──────────────────────────┘
┌─ # Example ──────────────┐   
│ ...                      │
└──────────────────────────┘
```

```latex
\begin{block}{Definition}     ... \end{block}

\begin{alertblock}{Watch out} ... \end{alertblock}

\begin{exampleblock}{Example} ... \end{exampleblock}
```

The `error:` and `#` are added for you, so write only the title. A block with an empty title, `\begin{block}{}` will give you a plain box.



### Tables

Table rules are drawn in the muted colour. If you load `booktabs`, the head row (between `\toprule` and `\midrule`) is set in the accent colour, with no extra commands:

```latex
\usepackage{booktabs}
...
\begin{tabular}{lr}
  \toprule
  Command & Time \\
  \midrule
  make    & 2.1 s \\
  make -j & 0.6 s \\
  \bottomrule
\end{tabular}
```

### Standout slides

A slide filled with the accent colour, for one big message:

```latex
\begin{frame}[standout]
  Questions?
\end{frame}
```

Standout slides are not counted for the frame total. There are some extra commands that Shebang provides for customizing the standout slide:

| You write                             | You get                                       |
| ------------------------------------- | --------------------------------------------- |
| `Questions \shebangprompt`            | `Questions [Y/n]`, and a `>` on the next line |
| `Shall we go on? \shebangprompt[y/N]` | Your custom choices within the brackets       |
| `Any questions \shebangprompt[]`      | Just the `>` on the next line                 |
| `Questions? \shebangcursor`           | `Questions? █`                                |

Both commands:`\shebangprompt` and `\shebangcursor` work in any slide when you're using Shebang. The cursor takes the text colour.



### Code

All text is already monospace, so code sits naturally on a slide. As in standard beamer, use `[fragile]` frames for `verbatim`, `listings`, or `minted`.



### Maths

Maths is set in a serif face (newtxmath), so formulas stay easy to read next to the monospace text.



## Further customisation

### Your own font

With `fonts=false`, Shebang loads no fonts, and the slides use whatever monospace font is active (Shebang sets all text in the typewriter family). If you want your own, load them after the theme. With pdfLaTeX:

```latex
\usetheme[fonts=false]{Shebang}
\usepackage[T1]{fontenc}
\usepackage[varqu]{z14} % Inconsolata
```

With XeLaTeX or LuaLaTeX:

```latex
\usetheme[fonts=false]{Shebang}
\usepackage{fontspec}
\setmonofont{JetBrains Mono}
\setsansfont{JetBrains Mono}
```

Loading `fontspec` resets the sans-serif font, which beamer uses for all slide text. Thus, the `\setsansfont` line is important.



## Troubleshooting

| Problem                                                                                            | Fix                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Package beamerthemeShebang Warning: IBM Plex Mono not found, using the default monospace font.`   | Install the font: `tlmgr install plex`                                                                                                                                 |
| `Package beamerthemeShebang Warning: newtxmath not found, using the default maths font.`           | Install the font: `tlmgr install newtx`                                                                                                                                |
| `Warning: Unknown variant '...', using 'env'.`                                                     | Check the spelling. Shebang only provides `env`, `light` and `dark`.                                                                                                   |
| `Warning: accent=... is faint as text on this variant's background or ... is hard to read text on` | Your accent is too close to the background. Pick a lighter one on `env`/`dark`, a darker one on `light` (see [Choosing an accent colour](#choosing-an-accent-colour)). |
| Title page shows `output.tex` or another name you didn't expect.                                   | The job name differs from the file name (Overleaf, build scripts). Add `\shebangfile{talk.tex}` to your preamble.                                                      |
| With `fonts=false` and `fontspec`, slides are in Latin Modern Sans                                 | Add `\setsansfont{...}` with the same font as `\setmonofont` (see [Your own font](#your-own-font)).                                                                    |
| Status bar text overlaps the progress bar                                                          | The short title is too long. Use `\title[Short]{Long title}`.                                                                                                          |
| Frame count shows `1` or the progress bar is empty                                                 |                                                                                                                                                                        |
