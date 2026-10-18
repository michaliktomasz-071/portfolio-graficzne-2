/* =========================================================================
   Portfolio Tomasz Michalik — logika współdzielona
   - sticky nav (stan po przewinięciu) + menu mobilne
   - scroll-reveal przez IntersectionObserver
   - lightbox (otwórz/zamknij/poprzedni/następny, ESC i strzałki)
   - rok w stopce, podświetlenie aktywnej strony
   Bez zależności. Działa po prostu z plików statycznych.
   ========================================================================= */
(function () {
  "use strict";

  /* ---- sticky nav: dodaj .scrolled po przewinięciu ---- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- menu mobilne (hamburger) ---- */
  var toggle = document.querySelector(".nav__toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    // zamknij menu po kliknięciu linku
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ---- podświetlenie aktywnej podstrony ---- */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    var target = a.getAttribute("href");
    if (target === here || (here === "" && target === "index.html") ||
        (here === "index.html" && target === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---- scroll-reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- rok w stopce ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =======================================================================
     Animowane liczniki (.ab-facts .num) — odliczają od 0 po wejściu w kadr.
     Liczba animowana, sufiks (np. " lat", "+") zachowany.
     ======================================================================= */
  var counters = document.querySelectorAll(".ab-facts .num");
  if (counters.length) {
    var reduceCount = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    counters.forEach(function (el) {
      var m = (el.textContent || "").match(/^(\d+)([\s\S]*)$/);
      if (!m) { el.dataset.skip = "1"; return; }
      el.dataset.target = m[1];
      el.dataset.suffix = m[2] || "";
      if (!reduceCount) el.textContent = "0" + el.dataset.suffix;
    });
    var runCount = function (el) {
      if (el.dataset.skip) return;
      var target = parseInt(el.dataset.target, 10), suffix = el.dataset.suffix || "";
      if (reduceCount) { el.textContent = target + suffix; return; }
      var dur = 1200, t0 = null;
      function tick(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      var ioC = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCount(e.target); ioC.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { ioC.observe(el); });
    } else {
      counters.forEach(runCount);
    }
  }

  /* =======================================================================
     Lightbox — zbiera wszystkie .card z atrybutami data-full / data-title
     ======================================================================= */
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-full]"));
  var lb = document.querySelector(".lightbox");
  if (cards.length && lb) {
    var lbImg = lb.querySelector(".lightbox__img");
    var lbCap = lb.querySelector(".lightbox__caption");
    var index = 0;

    function show(i) {
      index = (i + cards.length) % cards.length;
      var card = cards[index];
      lbImg.src = card.getAttribute("data-full");
      lbImg.alt = card.getAttribute("data-title") || "";
      if (lbCap) lbCap.textContent = card.getAttribute("data-title") || "";
    }
    function open(i) {
      show(i);
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    cards.forEach(function (card, i) {
      card.addEventListener("click", function () { open(i); });
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
      });
    });

    lb.querySelector(".lightbox__close").addEventListener("click", close);
    lb.querySelector(".lightbox__next").addEventListener("click", function () { show(index + 1); });
    lb.querySelector(".lightbox__prev").addEventListener("click", function () { show(index - 1); });
    // klik w tło (poza obrazem) zamyka
    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(index + 1);
      else if (e.key === "ArrowLeft") show(index - 1);
    });
  }

  /* =======================================================================
     Reflektor pod kursorem na zielonych panelach — jaśniejsza plama
     podążająca za myszką (steruje zmiennymi --mx/--my). Throttling przez rAF.
     ======================================================================= */
  document.querySelectorAll(".home-frame, .project-side").forEach(function (panel) {
    var N = 6;
    var pts = [];
    for (var k = 0; k < N; k++) pts.push({ x: -9999, y: -9999 });
    var cur = { x: -9999, y: -9999 }, tgt = { x: -9999, y: -9999 };
    var amp = 0, lastMove = -1e9, running = false;

    panel.addEventListener("mousemove", function (e) {
      var r = panel.getBoundingClientRect();
      tgt.x = e.clientX - r.left; tgt.y = e.clientY - r.top;
      lastMove = performance.now();
      if (cur.x < -9000) {
        cur.x = tgt.x; cur.y = tgt.y;
        for (var i = 0; i < N; i++) { pts[i].x = cur.x; pts[i].y = cur.y; }
      }
      if (!running) { running = true; requestAnimationFrame(loop); }
    });

    function loop() {
      var now = performance.now();
      cur.x += (tgt.x - cur.x) * 0.22;   // bezwładność (płynny ruch)
      cur.y += (tgt.y - cur.y) * 0.22;
      for (var i = N - 1; i > 0; i--) { pts[i].x = pts[i - 1].x; pts[i].y = pts[i - 1].y; }
      pts[0].x = cur.x; pts[0].y = cur.y;
      if (now - lastMove < 100) amp += (1 - amp) * 0.18;   // ruch → narasta
      else amp -= amp * 0.05;                              // bezruch → wygasa
      for (var j = 0; j < N; j++) {
        var a = amp * (1 - j / N) * 0.95;                  // ślad: starsze słabsze
        panel.style.setProperty("--p" + j + "x", pts[j].x.toFixed(1) + "px");
        panel.style.setProperty("--p" + j + "y", pts[j].y.toFixed(1) + "px");
        panel.style.setProperty("--p" + j + "a", a.toFixed(3));
      }
      if (amp > 0.01) { requestAnimationFrame(loop); }
      else { running = false; amp = 0; for (var m = 0; m < N; m++) panel.style.setProperty("--p" + m + "a", "0"); }
    }
  });

})();

/* Strona główna: galeria prac płynie powoli w dół (bezszwowa pętla).
   Po najechaniu myszką: pauza + ręczne scrollowanie i klikanie kafli. */
(function () {
  var gal = document.querySelector(".hero-gallery");
  if (!gal || gal.children.length === 0) return;
  if (window.matchMedia("(max-width: 860px)").matches) return;            // mobile: statycznie
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // duplikat kafli, żeby pętla była bezszwowa
  var originals = Array.prototype.slice.call(gal.children);
  var N = originals.length;
  originals.forEach(function (node) {
    var clone = node.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.tabIndex = -1;
    gal.appendChild(clone);
  });

  gal.style.scrollBehavior = "auto";   // by rAF nie kolidował ze smooth-scroll
  var speed = 0.5;                      // px na klatkę — powoli
  var paused = false;
  var pos = 0;

  // długość pętli = odległość pierwszego oryginału do pierwszego klonu
  function loopHeight() { return gal.children[N].offsetTop - gal.children[0].offsetTop; }

  function tick() {
    if (paused) {
      pos = gal.scrollTop;             // śledź ręczny scroll, by wznowić płynnie
    } else {
      pos += speed;
      var lh = loopHeight();
      if (lh > 0 && pos >= lh) pos -= lh;
      gal.scrollTop = pos;
    }
    requestAnimationFrame(tick);
  }

  gal.addEventListener("mouseenter", function () { paused = true; });
  gal.addEventListener("mouseleave", function () { paused = false; });
  gal.addEventListener("touchstart", function () { paused = true; }, { passive: true });
  gal.addEventListener("focusin", function () { paused = true; });
  gal.addEventListener("focusout", function () { paused = false; });

  requestAnimationFrame(tick);
})();
