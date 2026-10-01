const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const modulePath = path.join(__dirname, '../assets/js/downloads.js');
const api = fs.existsSync(modulePath) ? require(modulePath) : {};
function feature(name) {
  assert.equal(typeof api[name], 'function', `${name} download behavior is not implemented`);
  return api[name];
}
const winUrl = 'https://github.com/ATOMGAMERAGA/DPI-Bypass-Windows/releases/download/v9.4/DpiBypass-Setup-9.4.exe';
const apkUrl = 'https://github.com/ATOMGAMERAGA/DPI-Bypass-Android/releases/download/v9.4/DPIBypass-9.4.apk';
function response(assets, extra = {}) {
  return { ok: true, json: async () => ({ tag_name: 'v9.4', draft: false, prerelease: false, assets, ...extra }) };
}
test('Android phones use Android rather than the Linux platform in their user agent', () => {
  assert.equal(feature('detectOS')({ userAgent: 'Mozilla/5.0 (Linux; Android 16)', platform: 'Linux armv8l' }), 'android');
});
test('iPhones, iPads, Macs and Chromebooks are not offered an incompatible installer', () => {
  const detect = feature('detectOS');
  for (const nav of [
    { userAgent: 'iPhone', platform: 'iPhone' },
    { userAgent: 'Macintosh', platform: 'MacIntel', maxTouchPoints: 5 },
    { userAgent: 'Macintosh', platform: 'MacIntel' },
    { userAgent: 'X11; CrOS x86_64', platform: 'Linux x86_64' }
  ]) assert.equal(detect(nav), null);
});
test('Windows and desktop Linux are detected', () => {
  const detect = feature('detectOS');
  assert.equal(detect({ userAgent: 'Windows NT 10.0', platform: 'Win32' }), 'windows');
  assert.equal(detect({ userAgent: 'X11; Linux x86_64', platform: 'Linux x86_64' }), 'linux');
});
test('Windows chooses the current setup executable rather than portable or debug artifacts', async () => {
  const result = await feature('latestRelease')('windows', { fetch: async () => response([
    { name: 'portable.exe', browser_download_url: winUrl.replace('DpiBypass-Setup-9.4.exe', 'portable.exe') },
    { name: 'DpiBypass-Setup-9.4.exe', browser_download_url: winUrl }
  ]) });
  assert.equal(result.href, winUrl);
  assert.equal(result.version, 'v9.4');
  assert.equal(result.fallback, false);
});
test('Android chooses a release APK and ignores debug builds', async () => {
  const result = await feature('latestRelease')('android', { fetch: async () => response([
    { name: 'app-debug.apk', browser_download_url: apkUrl.replace('DPIBypass-9.4.apk', 'app-debug.apk') },
    { name: 'DPIBypass-9.4.apk', browser_download_url: apkUrl }
  ]) });
  assert.equal(result.href, apkUrl);
  assert.equal(result.fileName, 'DPIBypass-9.4.apk');
});
test('API rate limits preserve a usable latest release page instead of an old installer', async () => {
  const result = await feature('latestRelease')('android', { fetch: async () => ({ ok: false, status: 403 }) });
  assert.equal(result.href, 'https://github.com/ATOMGAMERAGA/DPI-Bypass-Android/releases/latest');
  assert.equal(result.fallback, true);
});
test('network failures preserve a usable latest release page', async () => {
  const result = await feature('latestRelease')('windows', { fetch: async () => { throw new Error('offline'); } });
  assert.equal(result.href, 'https://github.com/ATOMGAMERAGA/DPI-Bypass-Windows/releases/latest');
  assert.equal(result.fallback, true);
});
test('a release without the installer does not select source archives', async () => {
  const result = await feature('latestRelease')('android', { fetch: async () => response([{ name: 'source.zip', browser_download_url: apkUrl.replace('.apk', '.zip') }]) });
  assert.equal(result.fallback, true);
});
test('drafts, prereleases and download URLs outside the expected repository are rejected', async () => {
  const latest = feature('latestRelease');
  for (const extra of [{ draft: true }, { prerelease: true }]) {
    const result = await latest('android', { fetch: async () => response([{ name: 'DPIBypass.apk', browser_download_url: apkUrl }], extra) });
    assert.equal(result.fallback, true);
  }
  for (const url of ['https://example.com/app.apk', 'http://github.com/ATOMGAMERAGA/DPI-Bypass-Android/releases/download/v9.4/app.apk', apkUrl.replace('DPI-Bypass-Android', 'different-repo')]) {
    const result = await latest('android', { fetch: async () => response([{ name: 'DPIBypass.apk', browser_download_url: url }]) });
    assert.equal(result.fallback, true);
  }
});
test('a stalled API request stops waiting and offers the latest release page', async () => {
  const result = await feature('latestRelease')('android', { timeout: 15, fetch: () => new Promise(() => {}) });
  assert.equal(result.fallback, true);
});
