/* ===

Home page only.

1. The title flies into the header.
   As you scroll, the big "ThemeForge" shrinks and moves so that, after
   D pixels of scrolling, it covers the header's small "ThemeForge" exactly.
   D is simply how far the title has to travel to reach the header, so the
   title moves up with the page and only its size (and a few pixels of
   position) change. At that point the header takes over: .is-shown.

2. GitHub and the mode switch in the header fade in once the description
   line has scrolled away: .has-nav.

=== */

(function () {
    var head  = document.querySelector(".site-head.reveal");
    var brand = head && head.querySelector(".brand");
    var title = document.querySelector(".hero h1");
    var line  = document.getElementById("hero-line");
    if (!head || !brand || !title || !line) return;

    var still = window.matchMedia("(prefers-reduced-motion: reduce)");
    var m = null;        // measurements, see measure()
    var ticking = false;

    // Where things are with the page at the very top and nothing moved.
    function measure() {
        title.style.transform = "";
        var t = title.getBoundingClientRect(), b = brand.getBoundingClientRect();
        var s = parseFloat(getComputedStyle(brand).fontSize) / parseFloat(getComputedStyle(title).fontSize);
        m = {
            s:  s,                                    // final scale, e.g. 20.8 / 48
            D:  Math.max(1, t.top + scrollY - b.top), // scroll distance until the tops meet
            dx: b.left - t.left,                      // sideways shift (0 if both share the gutter)
            dy: (b.height - t.height * s) / 2         // small nudge so the centres line up
        };
    }

    function update() {
        ticking = false;
        var p = Math.min(1, Math.max(0, scrollY / m.D));   // 0 at the top, 1 when it has arrived
        if (still.matches) {
            title.style.transform = "";                     // reduced motion: no shrinking
        } else {
            var k = 1 + (m.s - 1) * p;
            title.style.transform = "translate(" + (m.dx * p) + "px, " + (m.dy * p) + "px) scale(" + k + ")";
        }
        var arrived = p >= 1;
        title.style.visibility = arrived ? "hidden" : "";
        head.classList.toggle("is-shown", arrived);
    }

    function onScroll() {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    function remeasure() {
        measure();
        update();
    }

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    if (document.fonts) document.fonts.ready.then(remeasure);   // web fonts change the sizes

    // 2. The header's links, once the description has gone
    if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
            var e = entries[0];
            head.classList.toggle("has-nav", !e.isIntersecting && e.boundingClientRect.top < 0);
        }).observe(line);
    } else {
        head.classList.add("has-nav");
    }
})();