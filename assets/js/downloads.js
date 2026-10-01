/* Shared by the browser and dependency-free Node regression tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DPIBypassDownloads = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var repositories = {
    windows: 'ATOMGAMERAGA/DPI-Bypass-Windows',
    android: 'ATOMGAMERAGA/DPI-Bypass-Android'
  };

  function detectOS(nav) {
    var ua = nav.userAgent || '';
    var platform = (nav.userAgentData && nav.userAgentData.platform) || nav.platform || '';
    if (/Android/i.test(ua + platform)) return 'android';
    if (/iPhone|iPad|iPod|Mac|CrOS/i.test(ua + platform)) return null;
    if (/Windows|Win32|Win64|WOW64/i.test(ua + platform)) return 'windows';
    if (/Linux|X11/i.test(ua + platform)) return 'linux';
    return null;
  }

  async function latestRelease(platform, options) {
    options = options || {};
    var repo = repositories[platform];
    if (!repo) throw new Error('Unsupported download platform');
    var fallback = { href: 'https://github.com/' + repo + '/releases/latest', version: '', fileName: '', fallback: true };
    var controller = new AbortController();
    var timer;
    try {
      var timeout = new Promise(function (_, reject) {
        timer = setTimeout(function () { controller.abort(); reject(new Error('Release lookup timed out')); }, options.timeout || 5000);
      });
      var lookup = (async function () {
        var response = await (options.fetch || fetch)('https://api.github.com/repos/' + repo + '/releases/latest', {
          headers: { Accept: 'application/vnd.github+json' },
          signal: controller.signal,
          cache: 'no-store',
          credentials: 'omit'
        });
        if (!response.ok) return fallback;
        var release = await response.json();
        if (release.draft || release.prerelease || !Array.isArray(release.assets)) return fallback;
        var candidates = release.assets.filter(function (asset) {
          if (!asset || !asset.name || /debug|unsigned|test|portable/i.test(asset.name)) return false;
          var expected = platform === 'android' ? /\.apk$/i : /(?:setup|installer).*\.exe$/i;
          if (!expected.test(asset.name)) return false;
          try {
            var url = new URL(asset.browser_download_url);
            return url.protocol === 'https:' && url.hostname === 'github.com' && !url.username && !url.password &&
              url.pathname.toLowerCase().startsWith('/' + repo.toLowerCase() + '/releases/download/');
          } catch (_) { return false; }
        });
        // Prefer one APK that works across architectures; otherwise let the user choose on GitHub.
        var universal = candidates.find(function (asset) { return /universal/i.test(asset.name); });
        var asset = universal || (candidates.length === 1 ? candidates[0] : null);
        if (!asset) return fallback;
        return { href: asset.browser_download_url, version: release.tag_name || '', fileName: asset.name, fallback: false };
      })();
      return await Promise.race([lookup, timeout]);
    } catch (_) {
      return fallback;
    } finally {
      clearTimeout(timer);
    }
  }

  return { detectOS: detectOS, latestRelease: latestRelease };
});
