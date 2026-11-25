/* ===

Shebang only: the live title page under "Use it".

The first line of a Shebang title page is a shell command that prints the
top of your .tex file:  $ head -n 2 talk.tex
This mirrors what beamerthemeShebang.sty does with \jobname:
  - quotes (") are dropped
  - a name with a space gets single quotes:  'my talk.tex'
  - "head -n 2" with a subtitle, "head -n 1" without

Colours and variant come from theme-page.js, which updates every .live.

=== */

(function () {
    var input = document.getElementById("file-input");
    var withSub = document.getElementById("file-subtitle");
    var file = document.getElementById("tp-file");
    var lines = document.getElementById("tp-lines");
    var sub = document.getElementById("tp-subtitle");
    if (!input || !file) return;

    function shown(name) {
        name = name.replace(/"/g, "").trim();
        name = name.replace(/\.tex$/i, "");              // the theme adds .tex itself
        if (name === "") name = input.placeholder.replace(/\.tex$/i, "");
        name = name + ".tex";
        return / /.test(name) ? "'" + name + "'" : name;
    }

    function render() {
        file.textContent = shown(input.value);
        lines.textContent = withSub.checked ? "2" : "1";
        sub.hidden = !withSub.checked;
    }

    input.addEventListener("input", render);
    withSub.addEventListener("change", render);
    render();
})();
