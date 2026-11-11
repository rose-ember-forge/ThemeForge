/*

Light/dark mode setting for the website

*/

(function () {
    var root = document.documentElement;
    var KEY = "themeforge:mode";
    var MODES = ["light", "auto", "dark"];

    var mode = "auto";
    try {
        var saved = localStorage.getItem(KEY);
        if (MODES.indexOf(saved) > -1) mode = saved;
    } catch (e) { /* private window, etc.: stay on auto */ }

    function apply() {
        if (mode === "auto") root.removeAttribute("data-mode");
        else root.setAttribute("data-mode", mode);

        document.querySelectorAll("[data-mode-btn]").forEach(function (b) {
            b.setAttribute("aria-pressed", String(b.getAttribute("data-mode-btn") === mode));
        });
    }

    // 1. Right away, while <head> is still loading: set data-mode.
    apply();

    // 2. Once the page exists: mark the pressed buttons and make them work.
    document.addEventListener("DOMContentLoaded", function () {
        apply();
        document.querySelectorAll("[data-mode-btn]").forEach(function (b) {
            b.addEventListener("click", function () {
                mode = b.getAttribute("data-mode-btn");
                try { localStorage.setItem(KEY, mode); } catch (e) { /* not saved, still works */ }
                apply();
            });
        });
    });
})();