/*

Light/dark mode setting for the website

*/

(function () {
    var root = document.documentElement;
    var theme = root.getAttribute("data-theme");
    if (theme) {
        try {
            var s = JSON.parse(localStorage.getItem("themeforge:" + theme) || "null");
            if (s && s.look && s.look !== "default") root.setAttribute("data-look", theme + "-" + s.look);
        } catch (e) {}
    }
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

    var fadeTimer;
    function fade() {
        var ms = parseFloat(getComputedStyle(root).getPropertyValue("--fade")) || 0;
        root.classList.add("is-switching");
        clearTimeout(fadeTimer);
        fadeTimer = setTimeout(function () { root.classList.remove("is-switching"); }, ms + 50);
    }
    window.themeforgeFade = fade;

    // 2. Once the page exists: mark the pressed buttons and make them work.
    document.addEventListener("DOMContentLoaded", function () {
        apply();
        document.querySelectorAll("[data-mode-btn]").forEach(function (b) {
            b.addEventListener("click", function () {
                fade();
                mode = b.getAttribute("data-mode-btn");
                try { localStorage.setItem(KEY, mode); } catch (e) { /* not saved, still works */ }
                apply();
            });
        });
    });
})();