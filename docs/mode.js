/*

Light/dark mode setting for the website

*/

(function () {
    var root = document.documentElement;
    var KEY = "themeforge:mode";
    var MODES = ["auto", "light", "dark"];
    var LABEL = { auto: "Auto", light: "Light", dark: "Dark" };

    var mode = "auto";
    try {
        var saved = localStorage.getItem(KEY);
        if (MODES.indexOf(saved) > -1) mode = saved;
    } catch (e) { /* private window, etc.: stay on auto */ }

    function apply() {
        if (mode === "auto") root.removeAttribute("data-mode");
        else root.setAttribute("data-mode", mode);

        var btn = document.getElementById("mode-btn");
        if (btn) {
            var next = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
            btn.textContent = LABEL[mode];
            btn.setAttribute("aria-label", "Colour mode: " + LABEL[mode] + ". Switch to " + LABEL[next] + ".");
        }
    }

    // Apply for at the beginning
    apply();

    document.addEventListener("DOMContentLoaded", function () {
        var btn = document.getElementById("mode-btn");
        if (!btn) return;
        apply();
        btn.addEventListener("click", function () {
            mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
            try { localStorage.setItem(KEY, mode); } catch (e) { /* not saved, still works */ }
            apply();
        });
    });

}) ();