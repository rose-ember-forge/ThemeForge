/* 

JS for the forge page. The wiring

*/

(function () {
    "use strict";
    var main = document.querySelector(".forge");
    if (!main || !document.getElementById("stage")) return;
    var NAME = main.getAttribute("data-name") || "In-the-Forge";
    var FILE = "In-the-Forge";

    // Stuff to print on the frame
    var CODE = [
        "\\NeedsTeXFormat{LaTeX2e}",
        "\\ProvidesPackage{beamertheme" + NAME + "}[MMXXVI/DEC v0.0]",
        "\\mode<presentation>",
        "\\newif\\if" + NAME + "@feature \\" + NAME + "featurefalse",
        "\\definecolor{myteal}{HTML}{069494}",
        "\\setbeamercolor{frametitle}{fg=myteal}",
        "\\setbeamerfont{frametitle}{size=\\Large}",
        "\\setbeamertemplate{itemize item}{\\color{myteal}\\textbullet}",
        "\\setbeamertemplate{footline}{%",
        "   \\hfill\\insertframenumber\\hspace{2em}}",
        "\\mode<all>"
    ];

    // Stuff to print as log
    var LOG = [
        "This is pdfTeX, version 3.141592653 (TeX Live 2026)",
        "(./" + FILE + ".tex (./beamertheme" + NAME + ".sty)",
        "Overfull \\hbox (2.3pt too wide) in paragraph at lines 12--14",
        "LaTeX Warning: Reference `fig:anvil' on page 1 undefined.",
        "! Undefined control sequence. l.42 \\forge",
        "Package beamer Warning: hammering still in progress."
    ];
    
    var DONE = "Output written on " + FILE + ".pdf (0 pages).";

    var AFTER = [
        "No pages of output.",
        "Transcript written on " + FILE + ".log",
        "(the anvil is getting warm)"
    ];

    var GLYPHS = ["\\", "{", "}", "%", "@", "#", "&", "[", "]", "A"];

    var $ = function(id) { return document.getElementById(id); };
    var stage   = $("stage"),
        rig     = $("rig"),
        anvil   = $("anvil"),
        slide   = $("slide"),
        src     = $("src"),
        frame   = $("frame"),
        heat    = $("heat"),
        glow    = $("glow"),
        ring    = $("ring"),
        fx      = $("fx"),
        bar     = $("bar"),
        hint    = $("hint"),
        log     = $("log"),
        title   = $("title");

    var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var busy = true, strikes = 0, progress = 33, canRestart = false;

    function u() { return stage.getBoundingClientRect().width / 40; }

    function colour(name) {
        var probe = document.createElement("span");
        probe.style.color = "var(" + name + ")";
        fx.appendChild(probe);
        var c = getComputedStyle(probe).color;
        probe.remove();
        return c;
    }
    function rnd(a,b) { return a + Math.random() * (b - a); }
    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    var IMPACT = { x: 14.868, y: 20.793 };

    function highlight(line) {
        return line.split(/(\\[A-Za-z@]+|\s+)/).filter(Boolean).map(function (p) {
			if (/^\s+$/.test(p)) return p;
			return '<span class="w ' + (p[0] === "\\" ? "cmd" : "arg") + '">' + p.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</span>";
		}).join("");
    }
    function showCode(chars) {                // the first `chars` characters, typed
		var left = chars, html = "";
		for (var i = 0; i < CODE.length; i++) {
			if (left <= 0) break;
			var piece = CODE[i].slice(0, left);
			left -= CODE[i].length;
			html += '<span class="ln">' + highlight(piece) + (left < 0 || i === CODE.length - 1 ? '<span class="cur"></span>' : "") + "</span>";
		}
		src.innerHTML = html;
	}
	function typeCode() {
		var total = CODE.join("").length, dur = 1100, t0 = performance.now();
		return new Promise(function (done) {
			(function step(now) {
				var n = Math.min(total, Math.ceil(total * (now - t0) / dur));
				showCode(n);
				if (n < total) requestAnimationFrame(step); else done();
			})(t0);
		});
	}

	// ---- One strike -------------------------------------------------------------
	// A single animation for the slide: crouch, raise, hang, drop, squash, rebound.
	// The impact happens at 56% (750 ms in), so the effects are timed to that.
	var STRIKE = 1340, HIT = 750;
	function swing() {
		var U = u(), face = 1.588 * U;           // the logo's slide floats 1.588 units above the anvil
		return slide.animate([
			{ offset: 0,     transform: "translateY(0) rotate(0) scale(1, 1)", easing: "ease-out" },
			{ offset: .119,  transform: "translateY(" + .35 * U + "px) rotate(0) scale(1.03, .93)", easing: "cubic-bezier(.2, .8, .3, 1)" },
			{ offset: .403,  transform: "translateY(" + -6.5 * U + "px) rotate(-7deg) scale(.98, 1.03)", easing: "linear" },
			{ offset: .463,  transform: "translateY(" + -6.8 * U + "px) rotate(-8deg) scale(.98, 1.03)", easing: "cubic-bezier(.6, 0, 1, .55)" },
			{ offset: .56,   transform: "translateY(" + face + "px) rotate(0) scale(1, 1)", easing: "ease-out" },
			{ offset: .612,  transform: "translateY(" + face + "px) rotate(0) scale(1.07, .86)", easing: "cubic-bezier(.2, 1.5, .4, 1)" },
			{ offset: 1,     transform: "translateY(0) rotate(0) scale(1, 1)" }
		], { duration: STRIKE });
	}

	function impact(first) {
		var U = u();
		// shake the whole stage, dip the anvil
		rig.animate([{ translate: "0 0" }, { translate: "-5px 2px" }, { translate: "4px -1px" }, { translate: "-3px 1px" }, { translate: "2px 0" }, { translate: "0 0" }],
			{ duration: 320, easing: "ease-out" });
		anvil.animate([{ translate: "0 0" }, { translate: "0 " + .25 * U + "px" }, { translate: "0 0" }],
			{ duration: 260, easing: "cubic-bezier(.2, .8, .3, 1)" });
		// heat: flash, bloom, shockwave
		heat.animate([{ opacity: 1 }, { opacity: .55, offset: .25 }, { opacity: 0 }], { duration: 700, easing: "ease-out" });
		glow.animate([{ opacity: 0, scale: .6 }, { opacity: 1, scale: 1, offset: .2 }, { opacity: 0, scale: 1.15 }], { duration: 900, easing: "ease-out" });
		ring.animate([{ opacity: .9, scale: ".15 .3" }, { opacity: 0, scale: "1 1" }], { duration: 650, easing: "cubic-bezier(.1, .7, .3, 1)" });
		// the code becomes the slide
		if (first) {
			shatterCode(U);
			frame.style.opacity = 1;
		}
		burst(U, first ? 16 : 11);
	}

	// Every word of code flies off on its own, then the code layer is gone.
	function shatterCode(U) {
		var sr = slide.getBoundingClientRect(), fr = fx.getBoundingClientRect();
		src.querySelectorAll(".w").forEach(function (w) {
			var r = w.getBoundingClientRect();
			var f = document.createElement("span");
			f.className = "frag";
			f.textContent = w.textContent;
			f.style.fontWeight = w.classList.contains("cmd") ? 700 : 400;
			var x0 = r.left - fr.left, y0 = r.top - fr.top;
			fx.appendChild(f);
			var cx = (r.left + r.width / 2) - (sr.left + sr.width / 2);          // push away from the slide's centre
			var vx = cx * rnd(1.2, 2.2) + rnd(-2, 2) * U, vy = rnd(-9, -3) * U, rot = rnd(-70, 70);
			f.animate([
				{ transform: "translate(" + x0 + "px," + y0 + "px) rotate(0)", opacity: 1 },
				{ transform: "translate(" + (x0 + vx * .5) + "px," + (y0 + vy * .6) + "px) rotate(" + rot / 2 + "deg)", opacity: .8, offset: .45 },
				{ transform: "translate(" + (x0 + vx) + "px," + (y0 + vy * .4 + 6 * U) + "px) rotate(" + rot + "deg)", opacity: 0 }
			], { duration: rnd(650, 950), easing: "cubic-bezier(.2, .6, .5, 1)" }).finished.then(function () { f.remove(); });
		});
		src.remove();
	}

	// Sparks: dots and a few TeX characters, thrown up and pulled down by gravity.
	function burst(U, n) {
		var hot = colour("--hot"), cool = colour("--accent");
		for (var i = 0; i < n; i++) {
			var glyph = i % 3 === 0;
			var s = document.createElement("span");
			s.className = "spark " + (glyph ? "glyph" : "dot");
			if (glyph) s.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
			fx.appendChild(s);
			var ang = rnd(-172, -8) * Math.PI / 180, speed = rnd(16, 32) * U;   // units per second
			var vx = Math.cos(ang) * speed, vy = Math.sin(ang) * speed, g = 48 * U;
			var T = rnd(.8, 1.3), spin = rnd(-540, 540), x0 = IMPACT.x * U + rnd(-4, 4) * U, y0 = IMPACT.y * U;
			var frames = [];
			for (var k = 0; k <= 10; k++) {
				var t = T * k / 10;
				var c = k < 3 ? hot : cool;
				var f = { transform: "translate(" + (x0 + vx * t) + "px," + (y0 + vy * t + g * t * t / 2) + "px) rotate(" + spin * k / 10 + "deg) scale(" + (1 - .6 * k / 10) + ")",
				          opacity: k === 10 ? 0 : 1 };
				f[glyph ? "color" : "backgroundColor"] = c;
				frames.push(f);
			}
			s.animate(frames, { duration: T * 1000, easing: "linear" }).finished.then((function (el) { return function () { el.remove(); }; })(s));
		}
	}

	// Embers drift up from the anvil for a few seconds, then stop.
	function embers(seconds) {
		var end = performance.now() + seconds * 1000;
		(function spawn() {
			if (performance.now() > end) return;
			var U = u(), e = document.createElement("span");
			e.className = "ember";
			fx.appendChild(e);
			var x = IMPACT.x * U + rnd(-9, 9) * U, y = IMPACT.y * U - rnd(0, 1) * U, rise = rnd(6, 11) * U, drift = rnd(-2, 2) * U;
			e.animate([
				{ transform: "translate(" + x + "px," + y + "px) scale(1)", opacity: 0 },
				{ opacity: .9, offset: .2 },
				{ transform: "translate(" + (x + drift) + "px," + (y - rise) + "px) scale(.3)", opacity: 0 }
			], { duration: rnd(1400, 2200), easing: "ease-out" }).finished.then(function () { e.remove(); });
			setTimeout(spawn, rnd(160, 320));
		})();
	}

	// The title rises in letter by letter.
	function revealTitle() {
		var text = title.textContent;
		title.setAttribute("aria-label", text);
		title.innerHTML = text.split(" ").map(function (word) {
			return '<span class="wd" aria-hidden="true">' + word.split("").map(function (c) { return '<span class="ch">' + c + "</span>"; }).join("") + "</span>";
		}).join(" ");
		title.querySelectorAll(".ch").forEach(function (ch, i) {
			ch.animate([{ opacity: 0, transform: "translateY(.5em)" }, { opacity: 1, transform: "none" }],
				{ duration: 420, delay: i * 28, easing: "cubic-bezier(.2, .8, .3, 1)", fill: "backwards" });
		});
	}

	// ---- Clicks: hammer again, fill the bar, print a log line ---------------------
	function addLog(text, done) {
		var li = document.createElement("li");
		li.textContent = text;
		if (done) li.className = "done";
		log.appendChild(li);
		while (log.children.length > 4) log.removeChild(log.firstChild);
	}
	function advance() {
		strikes++;
		if (progress < 100) {
			progress = Math.min(100, progress + 11);
			bar.style.setProperty("--p", progress + "%");
			if (progress >= 100) {
				addLog(DONE, true);
				hint.textContent = "Zero pages. It really isn't ready yet. Come back soon.";
			} else {
				addLog(LOG[(strikes - 1) % LOG.length]);
			}
		} else {
			addLog(AFTER[(strikes - 8) % AFTER.length]);
			if (strikes - 8 === AFTER.length - 1) canRestart = true;   // the log has run out: offer a restart
		}
	}
	stage.addEventListener("click", function () {
		if (busy) return;
		if (stage.classList.contains("can-restart")) { restart(); return; }
		advance();
		if (still) { if (canRestart) showRestart(); return; }   // reduced motion: the bar and log still respond
		busy = true;
		var a = swing();
		setTimeout(function () { impact(false); }, HIT);
		a.finished.then(function () { busy = false; if (canRestart) showRestart(); });
	});

	// ---- Start over ------------------------------------------------------------
	// The arrow draws itself onto the anvil: the arc's stroke is "unrolled" with
	// stroke-dashoffset (pathLength="1" makes the whole arc 1 long), then the head appears.
	function showRestart() {
		stage.classList.add("can-restart");
		stage.setAttribute("aria-label", "Start again");
		hint.textContent = "Click the anvil to start again.";
		if (still) return;
		$("again").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
		$("again-arc").animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 700, easing: "cubic-bezier(.4, 0, .2, 1)" });
		$("again-head").animate([{ opacity: 0, scale: .3 }, { opacity: 0, scale: .3, offset: .7 }, { opacity: 1, scale: 1 }],
			{ duration: 900, easing: "ease-out" });
		$("again-head").style.transformOrigin = "51.0px 37.9px";
	}

	function restart() {
		busy = true;
		canRestart = false;
		stage.classList.remove("can-restart");
		stage.setAttribute("aria-label", "Strike the anvil");
		stage.setAttribute("aria-disabled", "true");
		strikes = 0; progress = 33;
		bar.style.setProperty("--p", "33%");
		log.innerHTML = "";
		hint.textContent = "";
		title.textContent = title.getAttribute("aria-label") || title.textContent;
		title.removeAttribute("aria-label");
		frame.style.opacity = 0;
		src = document.createElement("span");          // a fresh code layer, under the heat flash
		src.className = "src";
		src.id = "src";
		slide.insertBefore(src, heat);
		intro();
	}

	// ---- Start -----------------------------------------------------------------
	function ready() {
		busy = false;
		stage.setAttribute("aria-disabled", "false");
		hint.textContent = "Click the anvil to keep hammering.";
	}

	function intro() {
		if (still) { src.remove(); frame.style.opacity = 1; ready(); return; }
		typeCode()
			.then(function () { return wait(250); })
			.then(function () {
				var a = swing();
				setTimeout(function () { impact(true); revealTitle(); }, HIT);
				setTimeout(function () { embers(4); }, HIT + 300);
				return a.finished;
			})
			.then(ready);
	}

	if (still) {
		// One still frame: the slide already forged, a few sparks frozen mid-air.
		src.remove();
		frame.style.opacity = 1;
		var U = u(), spots = [[-7, -5], [-4.5, -8], [-1, -9.5], [3.5, -8.5], [7, -6], [9.5, -3], [-9.5, -2.5]];
		spots.forEach(function (p, i) {
			var s = document.createElement("span");
			var glyph = i % 3 === 1;
			s.className = "spark " + (glyph ? "glyph" : "dot");
			if (glyph) s.textContent = GLYPHS[i % GLYPHS.length];
			s.style.transform = "translate(" + (IMPACT.x + p[0]) * U + "px," + (IMPACT.y + p[1] - 2) * U + "px)";
			s.style[glyph ? "color" : "background"] = "var(--accent)";
			s.style.opacity = .85;
			fx.appendChild(s);
		});
		ready();
	} else {
		intro();
	}
})();