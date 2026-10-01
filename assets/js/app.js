(function () {
  'use strict';
  var $ = function (selector) { return document.querySelector(selector); };
  var $$ = function (selector) { return Array.from(document.querySelectorAll(selector)); };
  var dialog = $('#download-dialog');
  var helper = window.DPIBypassDownloads;
  var tabs = $$('[role="tab"][data-platform]');
  var opener;
  var requests = { windows: 0, android: 0 };
  var toastTimer;

  function notify(message) {
    var toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('visible'); }, 3000);
  }

  async function refreshDownload(platform) {
    if (platform === 'linux') return;
    var link = $('[data-release="' + platform + '"]');
    var status = $('[data-status="' + platform + '"]');
    var repo = platform === 'android' ? 'DPI-Bypass-Android' : 'DPI-Bypass-Windows';
    var id = ++requests[platform];
    // A reopened dialog must never silently retain an outdated installer URL.
    link.href = 'https://github.com/ATOMGAMERAGA/' + repo + '/releases/latest';
    link.querySelector('span').textContent = platform === 'android' ? 'APK indir' : 'EXE indir';
    status.textContent = 'En güncel sürüm kontrol ediliyor…';
    var release = await helper.latestRelease(platform);
    if (id !== requests[platform]) return;
    link.href = release.href;
    link.querySelector('span').textContent = release.fallback ? 'GitHub’dan son sürümü indir' : (platform === 'android' ? 'APK indir' : 'EXE indir');
    status.textContent = release.fallback ? 'Son sürüm dosyalarını GitHub’da seçebilirsiniz.' : release.version + ' · ' + release.fileName;
  }

  function selectPlatform(platform, focus) {
    tabs.forEach(function (tab) {
      var active = tab.dataset.platform === platform;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    $$('.download-panel').forEach(function (panel) { panel.hidden = panel.id !== 'download-' + platform; });
    refreshDownload(platform);
  }

  if (dialog && helper && typeof dialog.showModal === 'function') {
    $$('[data-download]').forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        opener = trigger;
        var detected = helper.detectOS(navigator);
        var page = document.body.dataset.page;
        var platform = trigger.dataset.download || (['android', 'windows', 'linux'].includes(page) ? page : detected) || 'windows';
        $('#device-note').hidden = Boolean(detected);
        selectPlatform(platform);
        if (!dialog.open) dialog.showModal();
        document.body.classList.add('modal-open');
      });
    });
    $('#dialog-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) {
      if (event.target !== dialog) return;
      var bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', function () {
      document.body.classList.remove('modal-open');
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    });
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectPlatform(tab.dataset.platform); });
      tab.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        selectPlatform(tabs[next].dataset.platform, true);
      });
    });
  }

  $$('[data-copy]').forEach(function (button) {
    button.addEventListener('click', async function () {
      var code = button.closest('.code-block').querySelector('code');
      var original = button.textContent;
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(code.textContent.trim());
        button.textContent = 'Kopyalandı';
        notify('Kurulum komutu kopyalandı.');
        setTimeout(function () { button.textContent = original; }, 2200);
      } catch (_) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
        notify('Komut seçildi. Kopyalamak için Ctrl+C veya telefonunuzun kopyala menüsünü kullanın.');
      }
    });
  });

  var toggle = $('#theme-toggle');
  function syncTheme() {
    var dark = document.documentElement.dataset.theme === 'dark';
    toggle.setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');
    toggle.setAttribute('aria-pressed', String(dark));
    $('meta[name="theme-color"]').content = dark ? '#121916' : '#f7f8f5';
  }
  if (toggle) {
    syncTheme();
    toggle.addEventListener('click', function () {
      var theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem('dpib-theme', theme); } catch (_) {}
      syncTheme();
    });
  }
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
