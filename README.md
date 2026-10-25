# ThemeForge

Modern themes for LaTeX Beamer.

## Themes

| Theme    | Style            | Variants             |
| -------- | ---------------- | -------------------- |
| Meridian | light, minimal   | light, paper, dark   |
| Atelier  | editorial, serif | paper, linen, walnut |
| OldMoney | vintage feel     | ivory, emerald, ink  |

## Install

1. Download the theme's `.sty` from `themes/` and put it next to your `.tex` file.

2. The fonts called by the themes are all available in TeX Live. They should be a part of the system if you have texlive-full installed, or if you are using an online LaTeX engine. If you find any missing, install the fonts using (TeX Live):
   
       tlmgr install fira plex libertinus libertinus-type1 libertinus-otf
   
   MiKTeX installs missing fonts by itself the first time you compile.

## Usage

    \usetheme[variant=dark]{Meridian}

## Licence

LPPL 1.3c. See LICENSE.
