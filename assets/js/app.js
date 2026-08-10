/* ============================================================
   DPI Bypass — indirme sitesi
   Yapımcı: Atom Gamer Arda A.G.A
   ============================================================ */
(function () {
  "use strict";

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── Sürüm / bağlantı tablosu ─────────────────────────── */
  var OS = {
    windows: {
      label: ".exe dosyasını indirin",
      sub: "Windows 10 ve 11 · 1.0.0.22",
      href: "https://github.com/ATOMGAMERAGA/DPI-Bypass-Windows/releases/download/v1.0.0.22/DpiBypass-Setup-1.0.0.22.exe",
      direct: true
    },
    android: {
      label: ".apk dosyasını indirin",
      sub: "Android 12 ve üstü · 2.2.0",
      href: "https://github.com/ATOMGAMERAGA/DPI-Bypass-DC/releases/download/v2.2.0/DPIBypass-2.2.0.apk",
      direct: true
    },
    linux: {
      label: "Kurulum komutunu görün",
      sub: "Tek satırlık terminal kurulumu",
      href: "#indir",
      direct: false
    }
  };

  /* ── İşletim sistemi tahmini ──────────────────────────── */
  function detectOS() {
    var ua = navigator.userAgent || "";
    var plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";

    if (/Android/i.test(ua)) return "android";
    if (/iPhone|iPad|iPod/i.test(ua)) return "android";      // mobil kullanıcıya en yakın seçenek
    if (/Windows|Win32|Win64|WOW64/i.test(ua + plat)) return "windows";
    if (/Linux|X11|CrOS/i.test(ua + plat)) return "linux";
    if (/Mac/i.test(ua + plat)) return "linux";              // masaüstü — Unix tarafı
    return "windows";
  }

  /* ── Sekmeler ─────────────────────────────────────────── */
  var tabs   = $$(".os-card");
  var panels = $$(".panel");

  function selectOS(os, focus) {
    tabs.forEach(function (t) {
      var on = t.dataset.os === os;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach(function (p) { p.hidden = p.id !== "panel-" + os; });
    updateSmart(os);
    try { localStorage.setItem("dpib-os", os); } catch (e) {}
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectOS(tab.dataset.os); });
    tab.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      selectOS(tabs[(i + d + tabs.length) % tabs.length].dataset.os, true);
    });
  });

  /* ── Akıllı indirme düğmesi ───────────────────────────── */
  var smart      = $("#smart-download");
  var smartLabel = $("#smart-label");
  var smartSub   = $("#smart-sub");
  var smartIco   = $("#smart-ico");

  function updateSmart(os) {
    var d = OS[os];
    if (!d || !smart) return;

    smartLabel.textContent = d.label;
    smartSub.textContent   = d.sub;
    smart.href = d.href;

    // GitHub bağlantıları zaten "attachment" olarak servis edilir; ipucu olarak bırakıyoruz.
    if (d.direct) smart.setAttribute("download", "");
    else smart.removeAttribute("download");

    var src = $(".os-ico", $("#tab-" + os));
    if (src && smartIco) {
      smartIco.innerHTML = "";
      var clone = src.cloneNode(true);
      clone.removeAttribute("class");
      clone.setAttribute("width", "22");
      clone.setAttribute("height", "22");
      smartIco.appendChild(clone);
    }
  }

  if (smart) {
    smart.addEventListener("click", function () {
      // Doğrudan indirme de olsa indirme bölümünü açıkta bırak.
      var sec = $("#indir");
      if (sec) setTimeout(function () { sec.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
    });
  }

  var saved = null;
  try { saved = localStorage.getItem("dpib-os"); } catch (e) {}
  selectOS(saved && OS[saved] ? saved : detectOS());

  /* ── Kopyala ──────────────────────────────────────────── */
  var toast = $("#toast");
  var toastTimer;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }

  $$(".code .copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.closest(".code");
      var text = box.dataset.copy || $("code", box).textContent.trim();
      copyText(text).then(function () {
        var old = btn.textContent;
        btn.textContent = "Kopyalandı";
        btn.classList.add("done");
        showToast("Komut panoya kopyalandı");
        setTimeout(function () {
          btn.textContent = old;
          btn.classList.remove("done");
        }, 1900);
      }).catch(function () {
        showToast("Kopyalanamadı — komutu elle seçin");
      });
    });
  });

  /* ── Üst çubuk gölgesi ────────────────────────────────── */
  var nav = $("#nav");
  var onScroll = function () {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Görünüme girince belirme ─────────────────────────── */
  var targets = $$(".os-tabs, .feat, .faq details, .sec-head");
  if ("IntersectionObserver" in window && targets.length) {
    targets.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ── Yıl ──────────────────────────────────────────────── */
  var y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  /* ── Tema ─────────────────────────────────────────────── */
  var toggle = $("#theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("dpib-theme", next); } catch (e) {}
    });
  }
})();
