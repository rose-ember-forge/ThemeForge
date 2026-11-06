/* ===

Theme page behaviour

Functions for:
 - Look Switcher   sets data-look="Meridian-paper" (etc.) on <html>
 - Screenshots     every <img data-slide> follows the chosen variant
 - Accent Picker   only if the theme has an accent option
 - Code Snippet

=== */

(function (){
    var root = document.documentElement;

    var T = window.THEME, VARIANTS = T.variants;

    var STORE_KEY = "themeforge:" + T.name;

    var state = {
        look: "default",
        accent: null
    };

    // Helper functions

    function slideVariant() {
        return state.look === "default" ? T.defaultVariant : state.look;
    }

    // Calculating contrast between bg and accent
    // WCAG contrast ratio

    function luminance(hex) {
        var n = parseInt(hex.slice(1), 16);
        var rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (c) {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }

    function contrast (a, b) {
        var la = luminance(a), lb = luminance(b);
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
    }

    function mix(a, b, share) {
        var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16), out = "#";
        [16, 8, 0].forEach(function (shift) {
            var c = Math.round(((x >> shift) & 255) * share + ((y >> shift) & 255) * (1 - share));
            out += (c < 16 ? "0" : "") + c.toString(16);
        });
        return out.toUpperCase();
    }

    function save() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* private window, etc. */ }
    }

    function load() {
        try {
            var s = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
            if (s && (s.look === "default" || VARIANTS[s.look])) state.look = s.look;
            if (s && /^#[0-9a-f]{6}$/i.test(s.accent || "")) state.accent = s.accent;
        } catch (e) { /* ignore */ }
    }

    // Rendering the page

    function render() {
        var v = slideVariant();
        var accent = (state.accent || VARIANTS[v].accent).toUpperCase();

        // Look of the page.
        // The value must match the selectors in style.css exactly,
        // e.g. :root[data-look="Meridian-paper"].
        if (state.look === "default") root.removeAttribute("data-look");
        else root.setAttribute("data-look", T.name + "-" + state.look);
        document.querySelectorAll("[data-look-btn]").forEach(function (b) {
            b.setAttribute("aria-pressed", String(b.getAttribute("data-look-btn") === state.look));
        });

        // Screenshots for the variant.
        // data-slide=""        -> img/Meridian-paper.png      (title page)
        // data-slide="p3"      -> img/Meridian-paper-p3.png
        // data-slide="refs"    -> img/Meridian-paper-refs.png
        // The surrounding <a class="zoom"> gets the same file, so the enlarged view matches.
        document.querySelectorAll("img[data-slide]").forEach(function (img) {
            var slide = img.getAttribute("data-slide");
            var file = "img/" + T.name + "-" + v + (slide ? "-" + slide : "") + ".png";
            img.src = file;
            img.alt = T.name + " " + img.getAttribute("data-desc") + ", " + v + " variant";
            var link = img.closest("a.zoom");
            if (link) link.href = file;
        });
        var cap = document.getElementById("shots-cap");
        if (cap) cap.textContent = (state.look === "default" 
                ? "Compiled with default variant (" + v + "). " 
                : "Compiled with variant = " + v + ". " )
                + "Click a slide to enlarge it.";

        // Live slide and accent picker: only for themes with an accent option
        if (T.hasAccent) {
            var live = document.getElementById("live");
            live.setAttribute("data-variant", v);
            live.style.setProperty("--s-accent", accent);

            document.getElementById("accent-input").value = accent.toLowerCase();
            document.querySelectorAll(".swatch").forEach(function (s) {
                s.setAttribute("aria-pressed", String(!!state.accent && s.dataset.hex.toUpperCase() === accent));
            });

            var ratio = contrast(accent, VARIANTS[v].paper);
            var msg = document.getElementById("contrast");
            msg.textContent = ratio >= 4.5
                ? "Contrast " + ratio.toFixed(1) + ":1 on the " + v + " background. Good for visibility."
                : "Contrast " + ratio.toFixed(1) + ":1 on the " + v + " background. Accent might not stand out. Aim for 4.5:1 or more.";
            msg.classList.toggle("warn", ratio < 4.5);

            var cs = getComputedStyle(live);
            var colours = {
                paper:  cs.getPropertyValue("--s-paper").trim(),
                ink:    cs.getPropertyValue("--s-ink").trim(),
                accent: accent
            };
            colours.tint = mix(colours.accent, colours.paper, 0.10);   // the block background
            
            document.querySelectorAll(".pair").forEach(function (pair) {
                var chip = pair.querySelector(".pair-chip");
                var fg = colours[pair.dataset.fg], bg = colours[pair.dataset.bg];
                chip.style.color = fg;
                chip.style.background = bg;
                var r = contrast(fg, bg);
                var grade = r >= 4.5 ? "AA" : r >= 3 ? "large" : "low";
                pair.querySelector(".pair-ratio").textContent = r.toFixed(1) + " " + grade;
                chip.title = pair.dataset.fg + " on " + pair.dataset.bg + "\nContrast = " + r.toFixed(2) + ":1\n";
            });
        }

        // The snippet. Written the same way as in the guide: no spaces around "=".
        var opts = [];
        if (v !== T.defaultVariant) opts.push("variant=" + v);
        if (T.hasAccent && state.accent) opts.push("accent=" + accent.slice(1));
        document.getElementById("snippet").textContent =
            "\\usetheme" + (opts.length ? "[" + opts.join(", ") + "]" : "") + "{" + T.name + "}";
    }

    // Internal wiring

    document.querySelectorAll("[data-look-btn]").forEach(function (b) {
        b.addEventListener("click", function () {
            state.look = b.getAttribute("data-look-btn");
            render();
            save();
        });
    });

    if (T.hasAccent) {
        document.querySelectorAll(".swatch").forEach(function (s) {
            s.style.background = s.dataset.hex;
            s.addEventListener("click", function () {
                state.accent = s.dataset.hex.toUpperCase();
                render();
                save();
            });
        });

        document.getElementById("accent-input").addEventListener("input", function (e) {
            state.accent = e.target.value.toUpperCase();
            render();
            save();
        });

        document.getElementById("accent-reset").addEventListener("click", function () {
            state.accent = null;
            render();
            save();
        });
    }

    document.getElementById("copy").addEventListener("click", function () {
        var text = document.getElementById("snippet").textContent;
        var note = document.getElementById("copied");
        navigator.clipboard.writeText(text).then(function () {
            note.textContent = "Copied to the clipboard.";
        }).catch(function () {
            // snippet is selected to allow user to use CTRL + C
            var range = document.createRange();
            range.selectNodeContents(document.getElementById("snippet"));
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            note.textContent = "Press Ctrl + C to copy.";
        });
    });

    var bar = document.querySelector(".look-bar");
    if (bar && "IntersectionObserver" in window) {
        var marker = document.createElement("div");
        marker.setAttribute("aria-hidden", "true");
        marker.style.cssText = "height:1px; margin-bottom:-1px;";
        bar.before(marker);
        var stickTop = parseFloat(getComputedStyle(bar).top) || 0;
        new IntersectionObserver(function (entries) {
            var e = entries[0];
            bar.classList.toggle("is-floating", !e.isIntersecting && e.boundingClientRect.top < stickTop);
        }, { rootMargin: "-" + (stickTop + 1) + "px 0px 0px 0px" }).observe(marker);
    }

    load();
    render();

}) ();
