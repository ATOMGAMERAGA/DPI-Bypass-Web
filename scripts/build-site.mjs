import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = 'https://dpi.atomland.xyz';
const assetVersion = createHash('sha256').update(['assets/css/style.css', 'assets/js/downloads.js', 'assets/js/app.js'].map(file => readFileSync(path.join(root, file))).join('')).digest('hex').slice(0, 12);
const repo = {
  windows: 'https://github.com/ATOMGAMERAGA/DPI-Bypass-Windows',
  android: 'https://github.com/ATOMGAMERAGA/DPI-Bypass-Android',
  linux: 'https://github.com/ATOMGAMERAGA/DPI-Bypass-Linux'
};
const linuxCommand = 'curl -fsSL https://raw.githubusercontent.com/ATOMGAMERAGA/DPI-Bypass-Linux/main/install.sh | sudo bash';
const icons = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  windows: '<path d="M3 4h8v7H3zm10 0h8v7h-8zM3 13h8v7H3zm10 0h8v7h-8z"/>',
  android: '<path d="m7 5-2-3m12 3 2-3M4 11a8 8 0 0 1 16 0ZM4 14v4h16v-4M8 18v3m8-3v3"/><path d="M8 8h.01M16 8h.01"/>',
  linux: '<path d="m5 6 6 6-6 6m9 0h6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
  wifi: '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0M12 20h.01"/>'
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${icons[name]}</svg>`;
const button = (label = 'Ücretsiz indir', platform = '', cls = 'button-primary') => `<a class="button ${cls}" href="${platform ? `/${platform}/` : '/#indir'}" data-download="${platform}" aria-haspopup="dialog">${label}${icon('download')}</a>`;
const platforms = [
  { id: 'windows', name: 'Windows', spec: 'Windows 10 / 11 · 64 bit', file: 'EXE', desc: 'Bilgisayarınızdaki uygulamalar için DPI atlatma. Kolay kurulum ve otomatik bağlantı ayarları.' },
  { id: 'android', name: 'Android', spec: 'Android 12 ve üzeri', file: 'APK', desc: 'Telefon ve tabletinizde kullanın. Root gerektirmeyen uygulama ve tek dokunuşla bağlantı.' },
  { id: 'linux', name: 'Linux', spec: 'systemd · Python 3.8+', file: 'Terminal', desc: 'Linux masaüstünüz için yerel DPI atlatma servisi. Terminalden kurulum ve grafik arayüz.' }
];

function head(title, description, route, platform) {
  const url = site + route;
  const structured = [{ '@context': 'https://schema.org', '@type': 'WebSite', '@id': site + '/#website', name: 'DPI Bypass', url: site + '/', inLanguage: 'tr-TR' }];
  if (platform) structured.push({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: `DPI Bypass ${platform.name}`, operatingSystem: platform.name, applicationCategory: 'UtilitiesApplication', url, downloadUrl: platform.id === 'linux' ? repo.linux : repo[platform.id] + '/releases/latest', description, isAccessibleForFree: true, license: 'https://www.gnu.org/licenses/gpl-3.0.html', offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' } });
  if (route !== '/') structured.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DPI Bypass', item: site + '/' }, { '@type': 'ListItem', position: 2, name: platform ? platform.name : 'Sınırsız paylaşım', item: url }] });
  return `<!DOCTYPE html>
<html lang="tr" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="Atom Gamer Arda A.G.A">
<meta name="theme-color" content="#f7f8f5">
<link rel="canonical" href="${url}">
<meta property="og:locale" content="tr_TR">
<meta property="og:type" content="website">
<meta property="og:site_name" content="DPI Bypass">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site}/assets/img/social.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="DPI Bypass — Windows, Android ve Linux için açık kaynak uygulama">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${site}/assets/img/social.png">
<link rel="icon" href="/assets/img/favicon.ico" sizes="any">
<link rel="icon" href="/assets/img/logo.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/logo-256.png">
<script>try{var t=localStorage.getItem('dpib-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){}</script>
<link rel="stylesheet" href="/assets/css/style.css?v=${assetVersion}">
<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>
</head>`;
}

function header() {
  return `<a class="skip-link" href="#main">İçeriğe geç</a>
<header class="site-header"><div class="container header-inner">
  <a class="brand" href="/" aria-label="DPI Bypass ana sayfa"><img src="/assets/img/logo.svg" width="34" height="34" alt=""><span>DPI Bypass</span></a>
  <nav class="desktop-nav" aria-label="Ana menü"><a href="/#platformlar">Platformlar</a><a href="/sinirsiz-paylasim/">Sınırsız paylaşım</a><a href="/#sss">Sorular</a></nav>
  <div class="header-actions"><button class="theme-toggle" id="theme-toggle" aria-label="Koyu temaya geç" type="button">${icon('sun')}</button>${button('İndir', '', 'button-small button-primary')}</div>
</div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container">
  <div class="footer-top"><a class="brand" href="/"><img src="/assets/img/logo.svg" width="30" height="30" alt=""><span>DPI Bypass</span></a><p>Daha açık bir internet için, açık kaynak.</p></div>
  <div class="footer-grid"><div><span class="footer-label">Uygulamalar</span><a href="/windows/">Windows için DPI Bypass</a><a href="/android/">Android APK indir</a><a href="/linux/">Linux kurulumu</a></div><div><span class="footer-label">Keşfet</span><a href="/sinirsiz-paylasim/">Sınırsız internet paylaşımı</a><a href="/#sss">Sık sorulan sorular</a></div><div><span class="footer-label">Kaynak kod</span>${platforms.map(p => `<a href="${repo[p.id]}" target="_blank" rel="noopener noreferrer">${p.name} GitHub deposu ${icon('arrow')}</a>`).join('')}</div></div>
  <div class="footer-bottom"><p>© <span id="year">2026</span> Atom Gamer Arda A.G.A</p><p>GPL-3.0 · Ücretsiz ve açık kaynak</p></div>
</div></footer>`;
}

function modal() {
  return `<dialog id="download-dialog" class="download-dialog" aria-labelledby="download-title" aria-describedby="download-intro">
  <div class="dialog-header"><div><p class="eyebrow">DPI BYPASS</p><h2 id="download-title">Cihazınız için indirin.</h2></div><button id="dialog-close" class="icon-button" type="button" aria-label="İndirme penceresini kapat" autofocus>${icon('close')}</button></div>
  <p id="download-intro" class="dialog-intro">Platformunuzu seçin. Her zaman en güncel kararlı sürüme ulaşın.</p>
  <p id="device-note" class="device-note" hidden>Cihazınız otomatik eşleştirilemedi. iOS ve macOS için yerel uygulama bulunmuyor. Desteklenen platformları aşağıdan inceleyebilirsiniz.</p>
  <div class="platform-tabs" role="tablist" aria-label="İndirme platformu">${platforms.map((p, i) => `<button type="button" id="tab-${p.id}" role="tab" data-platform="${p.id}" aria-controls="download-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${icon(p.id)}${p.name}</button>`).join('')}</div>
  ${platforms.map(p => `<section class="download-panel" id="download-${p.id}" role="tabpanel" aria-labelledby="tab-${p.id}" tabindex="0" ${p.id !== 'windows' ? 'hidden' : ''}>
    <div class="download-summary"><div><h3>DPI Bypass ${p.name}</h3><p>${p.spec}</p></div><span class="file-type">${p.file}</span></div>
    ${p.id === 'linux' ? `<p class="download-help">Terminali açın ve kurulum komutunu çalıştırın.</p><div class="code-block"><code>${linuxCommand}</code><button class="copy-button" data-copy type="button">Komutu kopyala</button></div><p class="download-help">Komut, resmî GitHub deposundaki kurulum betiğini yönetici yetkisiyle çalıştırır. ${link(repo.linux + '/blob/main/install.sh', 'Betiği incele', true)}</p>` : `<a class="button button-primary download-file" data-release="${p.id}" href="${repo[p.id]}/releases/latest">${icon('download')}<span>${p.file} indir</span></a><p class="release-status" data-status="${p.id}" role="status">En güncel kararlı sürüm · GitHub Releases</p>`}
    <div class="quick-steps"><span>BAŞLAMAK İÇİN</span><ol>${p.id === 'windows' ? '<li>Kurulum dosyasını çalıştırın.</li><li>Uygulamayı açın ve bağlanın.</li>' : p.id === 'android' ? '<li>APK dosyasını telefon veya tabletinize kurun.</li><li>Uygulamayı açın ve yerel VPN iznini onaylayın.</li>' : '<li>Kurulum tamamlanınca DPI Bypass’ı açın.</li><li>Otomatik modu seçip bağlanın.</li>'}</ol></div>
    <div class="download-links"><a href="/${p.id}/">Kurulum rehberi ${icon('arrow')}</a>${link(p.id === 'linux' ? repo.linux : repo[p.id] + '/releases/latest', p.id === 'linux' ? 'Kaynak kod' : 'GitHub sürümleri', true)}</div>
  </section>`).join('')}
  <p class="dialog-footnote">Ücretsiz. Açık kaynak. Dosyalar resmî GitHub depolarından gelir.</p>
</dialog><div id="toast" class="toast" role="status" aria-live="polite"></div>`;
}

function link(url, text, external = false) {
  return `<a href="${url}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
}

function end() {
  return `${footer()}${modal()}<script src="/assets/js/downloads.js?v=${assetVersion}" defer></script><script src="/assets/js/app.js?v=${assetVersion}" defer></script></body></html>`;
}

function deviceArt() {
  return `<div class="connection-art" role="img" aria-label="DPI Bypass ile telefon, tablet ve bilgisayarda yerel bağlantı; şematik gösterim">
    <span class="art-label">BAĞLANTI SİZİN CİHAZINIZDA.</span>
    <div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div>
    <div class="art-desktop"><div class="desktop-top"><i></i><i></i><i></i><span>DPI Bypass</span></div><div class="desktop-content"><img src="/assets/img/logo.svg" width="66" height="66" alt=""><span class="connection-line"></span><strong>İnternete bir adım daha yakın.</strong><p>Yerel işleme. Doğrudan bağlantı.</p></div><div class="desktop-bottom"><span class="status-dot"></span>Açık kaynak <span>Windows / Linux</span></div></div>
    <div class="art-phone"><div class="phone-notch"></div><span class="phone-time">09:41</span><div class="phone-content">${icon('wifi')}<strong>DPI Bypass</strong><span>Android</span><div class="phone-connect">${icon('check')}</div><small>Telefon &amp; tablet</small></div><div class="phone-home"></div></div>
    <span class="art-caption">Üç platform. Aynı özgürlük.</span>
  </div>`;
}

function faq(items) {
  return `<div class="faq-list">${items.map(([question, answer]) => `<details><summary>${question}<span aria-hidden="true">+</span></summary><div class="faq-answer">${answer}</div></details>`).join('')}</div>`;
}

function home() {
  return `${head('DPI Bypass — Android, Windows ve Linux için ücretsiz indir', 'DPI Bypass ile DPI ve DNS engellerine karşı yerel bağlantı. Android APK, Windows ve Linux indirmeleri, kurulum rehberleri ve sınırsız internet paylaşım modu.', '/')}
<body data-page="home">${header()}<main id="main">
<section class="hero container" id="indir"><div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span>ÜCRETSİZ &amp; AÇIK KAYNAK</p><h1>Daha özgür<br>bir internet<span class="accent">.</span></h1><p class="hero-description">DPI Bypass ile Discord ve DPI engelli servislere erişin. Trafiğiniz uzak bir VPN sunucusuna yönlendirilmeden, kendi cihazınızda işlenir.</p><div class="hero-actions">${button()}<a class="text-link" href="#platformlar">Platformları keşfet ${icon('arrow')}</a></div><p class="hero-platforms">${icon('windows')} Windows <span>·</span>${icon('android')} Android <span>·</span>${icon('linux')} Linux</p></div>${deviceArt()}</section>
<div class="container"><div class="benefit-strip"><div>${icon('globe')}<span><strong>Doğrudan bağlantı</strong><small>Uzak VPN sunucusu olmadan</small></span></div><div>${icon('code')}<span><strong>Tamamen açık kaynak</strong><small>Kodu inceleyin, ücretsiz kullanın</small></span></div><div>${icon('check')}<span><strong>Kolay başlangıç</strong><small>Cihazınıza uygun uygulamayı seçin</small></span></div></div></div>
<section class="section container" id="platformlar"><div class="section-heading"><div><p class="eyebrow">CİHAZINIZA UYGUN</p><h2>Nerede kullanmak istersiniz?</h2></div><p>Bilgisayar, telefon ya da tablet.<br>Size uygun sürüm burada.</p></div><div class="platform-grid">${platforms.map(p => `<article class="platform-card"><div class="platform-card-top">${icon(p.id)}<span>${p.file}</span></div><h3>DPI Bypass ${p.name}</h3><p>${p.desc}</p><small>${p.spec}</small><div class="platform-card-actions">${button(p.id === 'linux' ? 'Kuruluma başla' : `${p.name} için indir`, p.id, 'button-outline')}<a href="/${p.id}/">Kurulum rehberi ${icon('arrow')}</a></div></article>`).join('')}</div></section>
<section class="sharing-section container"><div class="sharing-inner"><div class="sharing-copy"><p class="eyebrow">SINIRSIZ PAYLAŞIM MODU</p><h2>Mobil internetiniz,<br>diğer cihazlarınızda.</h2><p>Uyumlu sınırsız mobil paketinizi erişim noktası üzerinden bilgisayarınıza, Android telefonunuza veya tabletinize paylaşın. DPI Bypass’ın paylaşım modu, bağlantıyı kullanan cihazda çalışır.</p><a class="button button-white" href="/sinirsiz-paylasim/">Nasıl kullanılır? ${icon('arrow')}</a><p class="carrier-list">Türk Telekom <span>·</span> Turkcell <span>·</span> Vodafone</p><small class="sharing-note">Uyumluluk, operatör ve tarifenin paylaşım koşullarına bağlıdır.</small></div><div class="sharing-visual" aria-hidden="true"><div class="sharing-source">${icon('wifi')}<span>Mobil erişim noktası</span></div><div class="sharing-branches"><span></span><span></span></div><div class="sharing-targets"><div><svg viewBox="0 0 64 54"><rect x="10" y="4" width="44" height="30" rx="3"/><path d="M4 44h56l-6-10H10Z"/><path d="M26 39h12"/></svg><span>Bilgisayar</span></div><div><svg viewBox="0 0 64 54"><rect x="18" y="2" width="28" height="48" rx="5"/><path d="M29 8h6m-6 36h6"/></svg><span>Telefon &amp; tablet</span></div></div><p>Paylaş. Bağlan. Devam et.</p></div></div></section>
<section class="section container how-section" id="nasil-calisir"><div><p class="eyebrow">KISA BİR AÇIKLAMA</p><h2>VPN’den farklı.<br>Bağlantınıza daha yakın.</h2></div><div class="how-copy"><p>DPI, internet sağlayıcısının bağlantı paketlerini incelemesidir. DPI Bypass, bağlantının ilk paketlerini yerelde yeniden düzenleyerek bu incelemeye dayanan engelleri aşmayı amaçlar.</p><p>Uzak bir VPN sunucusu kullanmaz. IP adresinizi gizlemez ve anonimlik sağlamaz. Çalışan yöntem, ağınıza ve sağlayıcınıza göre değişebilir.</p><a class="text-link" href="${repo.android}" target="_blank" rel="noopener noreferrer">Kaynak kodu inceleyin ${icon('arrow')}</a></div></section>
<section class="section container faq-section" id="sss"><div><p class="eyebrow">AKLINIZDA KALMASIN</p><h2>Birkaç kısa cevap.</h2><p class="section-description">Başlamadan önce bilmeniz gerekenler.</p></div>${faq([
  ['DPI Bypass ücretsiz mi?', '<p>Evet. Android, Windows ve Linux sürümleri ücretsizdir. Kaynak kodlar GPL-3.0 lisansı ile GitHub üzerinde paylaşılır.</p>'],
  ['Telefon ve tabletlerde çalışıyor mu?', '<p>Android 12 ve üzeri telefon ve tabletler için APK sürümü vardır. Root gerekmez. iOS ve macOS için yerel bir uygulama bulunmuyor.</p><p><a href="/android/">Android indirme ve kurulum rehberi</a></p>'],
  ['Android neden VPN izni istiyor?', '<p>Android uygulaması, trafiği cihaz içinde işlemek için sistemin yerel VPN arayüzünü kullanır. Bu izin, trafiğinizin uzak bir VPN sunucusuna gönderildiği anlamına gelmez. Aynı anda başka bir VPN uygulaması kullanımı çakışabilir.</p>'],
  ['Sınırsız internet paylaşım modu nasıl kullanılır?', '<p>Telefonunuzun mobil erişim noktasına bağlanın. Bağlanan cihazda DPI Bypass’ı kurun ve ayarlardaki Vodafone Sınırsız Modu’nu açın. PC sürümleri de bu modu destekler. Sonuç, kullanılan paket ve ağ koşullarına bağlıdır.</p><p><a href="/sinirsiz-paylasim/">Paylaşım rehberini inceleyin</a></p>'],
  ['İndirme bağlantıları güncel mi?', '<p>İndirme penceresi GitHub’daki en güncel kararlı sürümün APK veya Windows kurulum dosyasını bulur. Sürüm bilgisi alınamazsa GitHub’ın son sürüm sayfasını açar. Linux kurulumu resmî depodaki güncel kurulum betiğini kullanır.</p>']
])}</section>
</main>${end()}`;
}

const guides = {
  android: {
    title: 'DPI Bypass Android APK indir — Telefon ve tablet kurulumu',
    description: 'DPI Bypass Android APK dosyasının en güncel sürümünü indirin. Android 12 ve üzeri telefon ve tabletlerde rootsuz kurulum, yerel VPN izni ve paylaşım modu rehberi.',
    heading: 'DPI Bypass.<br>Android için.',
    intro: 'Telefonunuzda veya tabletinizde, tek dokunuşla. Android için açık kaynak DPI Bypass uygulamasını resmî GitHub deposundan indirin.',
    steps: [
      ['Güncel APK dosyasını indirin.', 'İndir düğmesi, GitHub’daki en son kararlı sürümü bulur. APK, uygulamanın Android kurulum dosyasıdır. Dosyayı telefon veya tabletinizin İndirilenler klasöründe bulabilirsiniz.'],
      ['APK dosyasını açıp kurun.', 'Android isterse dosyayı açtığınız tarayıcı veya dosya yöneticisi için “Bu kaynaktan uygulama yükle” iznini verin. Resmî depodan indirdiğiniz dosyayı seçip Kur’a dokunun.'],
      ['Yerel VPN iznini onaylayın.', 'DPI Bypass’ı açıp bağlantıyı başlatın. Android’in VPN bağlantı isteğini onaylayın. Uygulama bu arayüzü paketleri cihazınızda işlemek için kullanır; uzak bir VPN sunucusuna bağlanmaz.'],
      ['Otomatik modla başlayın.', 'Uygulama, ağınızda çalışan bağlantı yöntemini arar. Wi-Fi veya mobil veriyle kullanabilirsiniz. Bağlantı sağlandıktan sonra erişmek istediğiniz servisi yeniden açın.']
    ],
    requirements: '<li>Android 12 veya üzeri bir telefon ya da tablet.</li><li>Root erişimi gerekmez.</li><li>Kurulum için APK yükleme izni, bağlantı için yerel VPN izni.</li>',
    details: '<h2>Telefon ve tablet desteği</h2><p>Aynı Android APK’sını uyumlu telefon ve tabletlerde kullanabilirsiniz. Tabletinizi telefonun mobil erişim noktasına bağladığınızda uygulamayı bağlantıyı kullanan tablete kurun.</p><h2>Android uygulamasını güncelleme</h2><p>Bu sayfadaki indirme düğmesi her zaman son kararlı sürüme yönlenir. Yeni APK’yı mevcut uygulamanın üzerine kurabilirsiniz. Otomatik güncelleme takibi için Obtainium’a resmî Android GitHub deposunu kaynak olarak ekleyebilirsiniz.</p>',
    faqs: [
      ['Google Play’den indirilebilir mi?', '<p>Bu sitedeki dağıtım kanalı resmî GitHub Releases sayfasıdır. İndir düğmesi APK dosyasını veya en güncel sürüm sayfasını açar.</p>'],
      ['iPhone’da bu APK çalışır mı?', '<p>Hayır. APK dosyası Android içindir. iPhone ve iPad için DPI Bypass’ın yerel iOS sürümü bulunmuyor.</p>'],
      ['Başka bir VPN ile birlikte kullanılabilir mi?', '<p>Android genellikle aynı anda tek bir VPN bağlantısına izin verir. Başka bir VPN uygulaması açıksa DPI Bypass’ın yerel VPN arayüzüyle çakışabilir.</p>']
    ]
  },
  windows: {
    title: 'DPI Bypass Windows indir — Windows 10 ve 11 kurulumu',
    description: 'DPI Bypass Windows uygulamasının en güncel EXE kurulumunu indirin. Windows 10 ve 11 için DPI atlatma, otomatik bağlantı ve sınırsız paylaşım modu rehberi.',
    heading: 'DPI Bypass.<br>Windows için.',
    intro: 'Bilgisayarınızdaki uygulamalar için doğrudan bağlantı. Windows sürümünü indirin, kurun ve ağınıza uygun yöntemi otomatik modla bulun.',
    steps: [
      ['Güncel kurulumu indirin.', 'İndir düğmesi resmî Windows deposundaki en güncel kararlı EXE kurulum dosyasını bulur. Taşınabilir dosyalar ve alternatifler için GitHub sürümlerini inceleyebilirsiniz.'],
      ['Kurulum dosyasını çalıştırın.', 'İndirilenler klasöründeki kurulum dosyasını açın. Ağ paketlerinin işlenebilmesi için yönetici izni gerekir. Dosyanın resmî GitHub deposundan geldiğini kontrol ederek kurulum sihirbazını tamamlayın.'],
      ['DPI Bypass’ı açın.', 'Uygulamayı Başlat menüsünden açın. Otomatik bağlantı modunu seçin; uygulama ağınız için kullanılabilecek yöntemleri test eder.'],
      ['Bağlantınızı deneyin.', 'Bağlantı hazır olduğunda Discord veya erişmek istediğiniz servisi yeniden açın. Ağınız değişirse otomatik testi tekrar çalıştırabilirsiniz.']
    ],
    requirements: '<li>Windows 10 sürüm 1809 veya üzeri / Windows 11.</li><li>64 bit işletim sistemi.</li><li>Kurulum ve ağ işlemleri için yönetici izni.</li>',
    details: '<h2>Windows’ta DPI atlatma</h2><p>Uygulama bağlantı paketlerini bilgisayarınızda işler. Trafik uzak bir VPN sunucusundan geçmez. Ağ ve internet sağlayıcısı değiştiğinde çalışan strateji de değişebilir; otomatik mod uygun yöntemi bulmayı amaçlar.</p><h2>Mobil erişim noktasıyla kullanım</h2><p>Bilgisayarınızı telefonunuzun erişim noktasına bağlayıp uygulamanın DNS ve ayarlar bölümünden Vodafone Sınırsız Modu’nu açabilirsiniz. Kullanılacak ağı kaydedin ve modun o ağda etkin olduğunu uygulamadaki durum alanından kontrol edin.</p>',
    faqs: [
      ['Windows 7 veya 32 bit destekleniyor mu?', '<p>Bu sürüm Windows 10 ve Windows 11’in 64 bit sürümleri içindir. Windows 7, Windows 8 ve 32 bit sistemler desteklenmez.</p>'],
      ['Taşınabilir sürüm nerede?', `<p>Kurulum gerektirmeyen alternatif dosyalar, yayınlandıkları sürümün <a href="${repo.windows}/releases/latest" target="_blank" rel="noopener noreferrer">resmî GitHub sayfasında</a> bulunur.</p>`],
      ['Uygulamayı nasıl kaldırırım?', '<p>Windows Ayarlar → Uygulamalar bölümünde DPI Bypass’ı seçerek normal bir uygulama gibi kaldırabilirsiniz.</p>']
    ]
  },
  linux: {
    title: 'DPI Bypass Linux kurulumu — Ubuntu, Debian, Fedora ve Arch',
    description: 'DPI Bypass Linux kurulum rehberi. Ubuntu, Debian, Fedora ve Arch gibi systemd tabanlı dağıtımlarda güncel kurulum betiği, gereksinimler ve paylaşım modu.',
    heading: 'DPI Bypass.<br>Linux için.',
    intro: 'Linux masaüstünüz için açık kaynak DPI atlatma. Güncel kurulum betiğiyle başlayın, grafik arayüz veya terminal üzerinden bağlantınızı yönetin.',
    steps: [
      ['Dağıtımınızın gereksinimlerini kontrol edin.', 'Servis için systemd ve Python 3.8+ gerekir. Grafik arayüz GTK 4 ve libadwaita kullanır. Ubuntu, Debian, Linux Mint, Fedora ve Arch gibi dağıtımların paket desteği resmî depoda açıklanır.'],
      ['Resmî kurulum betiğini çalıştırın.', `Aşağıdaki komut depodaki güncel install.sh betiğini indirip yönetici yetkisiyle çalıştırır. Betiği çalıştırmadan önce <a href="${repo.linux}/blob/main/install.sh" target="_blank" rel="noopener noreferrer">GitHub’da inceleyebilirsiniz</a>.<div class="code-block"><code>${linuxCommand}</code><button class="copy-button" data-copy type="button">Komutu kopyala</button></div>`],
      ['Uygulamayı açıp bağlanın.', 'Kurulum tamamlandığında uygulamalar menüsünden DPI Bypass’ı açın. Otomatik mod, ağınız için çalışan bağlantı stratejisini arar.'],
      ['Servisin durumunu kontrol edin.', 'Terminalde <code>dpi-bypass status</code> ile servis durumunu, <code>dpi-bypass logs -f</code> ile canlı günlükleri görebilirsiniz.']
    ],
    requirements: '<li>systemd kullanan, desteklenen bir Linux dağıtımı.</li><li>Python 3.8+ ve nftables / iptables.</li><li>Grafik arayüz için GTK 4 ve libadwaita 1.2+.</li><li>Paket kurulumu ve ağ kuralları için yönetici yetkisi.</li>',
    details: '<h2>Ubuntu, Debian, Fedora ve Arch</h2><p>Kurulum betiği dağıtımı algılayıp desteklenen paket yöneticisini kullanır. Dağıtım sürümleri arasında paket isimleri ve arayüz bağımlılıkları değişebilir; güncel destek ayrıntıları için Linux deposunun README dosyasını inceleyin.</p><h2>Linux’ta sınırsız paylaşım modu</h2><p>Telefonunuzun erişim noktasına bağlandıktan sonra Ayarlar → Gelişmiş → Vodafone sınırsız modu seçeneğini kullanabilirsiniz. Mod kayıtlı paylaşım ağıyla ilişkilendirilir; yönetici izni istenir.</p>',
    faqs: [
      ['Linux için sabit sürüm indirmem gerekiyor mu?', '<p>Bu sayfadaki komut main dalındaki güncel kurulum betiğini kullanır. Belirli bir eski sürüme sabitlenmez.</p>'],
      ['Grafik arayüz zorunlu mu?', '<p>Servis ve komut satırı araçları için grafik arayüz gerekmez. Masaüstü arayüzünü kullanmak için GTK 4 ve libadwaita bağımlılıkları gerekir.</p>'],
      ['Uygulamayı nasıl kaldırırım?', `<p>Resmî depodan aldığınız <code>install.sh</code> dosyasının bulunduğu klasörde <code>sudo bash install.sh --uninstall</code> çalıştırın. Güncel kullanım bilgileri için <a href="${repo.linux}" target="_blank" rel="noopener noreferrer">Linux deposunu</a> inceleyin.</p>`]
    ]
  }
};

function platformPage(platform) {
  const g = guides[platform.id];
  return `${head(g.title, g.description, `/${platform.id}/`, platform)}<body data-page="${platform.id}">${header()}<main id="main" class="container guide-main">
<nav class="breadcrumbs" aria-label="Konum"><a href="/">Ana sayfa</a><span aria-hidden="true">/</span><span>${platform.name}</span></nav>
<section class="guide-hero"><div><p class="eyebrow">${icon(platform.id)} ${platform.spec}</p><h1>${g.heading}</h1><p class="hero-description">${g.intro}</p><div class="hero-actions">${button(platform.id === 'linux' ? 'Kurulum komutunu aç' : `${platform.file} indir`, platform.id)}${link(platform.id === 'linux' ? repo.linux : repo[platform.id] + '/releases/latest', 'GitHub’da incele', true)}</div></div><aside class="requirements"><span class="eyebrow">BAŞLAMADAN ÖNCE</span><h2>Gerekenler</h2><ul>${g.requirements}</ul><p>Ücretsiz · GPL-3.0 · Açık kaynak</p></aside></section>
<div class="guide-layout"><article class="guide-content"><section id="kurulum"><p class="eyebrow">ADIM ADIM</p><h2>${platform.name} kurulum rehberi</h2><ol class="install-steps">${g.steps.map(([title, text]) => `<li><h3>${title}</h3><div>${text}</div></li>`).join('')}</ol></section><section class="guide-details">${g.details}</section><section class="guide-faq"><h2>Sık sorulan sorular</h2>${faq(g.faqs)}</section></article><aside class="guide-sidebar"><h2>Diğer cihazlarınız</h2>${platforms.filter(p => p.id !== platform.id).map(p => `<a href="/${p.id}/">${icon(p.id)}<span>DPI Bypass ${p.name}</span>${icon('arrow')}</a>`).join('')}<a href="/sinirsiz-paylasim/">${icon('wifi')}<span>Sınırsız paylaşım</span>${icon('arrow')}</a><p>Telefonunuzdaki mobil interneti bilgisayarınızda veya tabletinizde kullanmak için paylaşım rehberine göz atın.</p></aside></div>
</main>${end()}`;
}

function sharingPage() {
  return `${head('DPI Bypass sınırsız internet paylaşımı — Telefon, tablet ve PC', 'DPI Bypass sınırsız paylaşım modu rehberi. Uyumlu Türk Telekom, Turkcell ve Vodafone mobil paketlerini Android, Windows ve Linux cihazlarında kullanma adımları.', '/sinirsiz-paylasim/')}<body data-page="sharing">${header()}<main id="main" class="container guide-main">
<nav class="breadcrumbs" aria-label="Konum"><a href="/">Ana sayfa</a><span aria-hidden="true">/</span><span>Sınırsız paylaşım</span></nav>
<section class="guide-hero"><div><p class="eyebrow">TELEFONDAN DİĞER CİHAZLARINIZA</p><h1>Mobil internetinizi<br>birlikte kullanın<span class="accent">.</span></h1><p class="hero-description">Uyumlu sınırsız mobil paketinizi erişim noktasıyla paylaşın. Android telefon ve tabletinizde, Windows veya Linux bilgisayarınızda DPI Bypass’ın paylaşım modunu kullanın.</p><div class="hero-actions">${button('Uygulamayı indir')}<a href="#paylasim-adimlari">Kullanım adımları ↓</a></div></div><aside class="requirements sharing-requirements"><span class="eyebrow">DESTEKLENEN SENARYO</span><h2>Bir telefon.<br>Birden fazla cihaz.</h2><ul><li>Uyumlu sınırsız mobil internet paketi.</li><li>Telefonunuzda açık mobil erişim noktası.</li><li>Bağlanan cihazda DPI Bypass.</li></ul><p>Türk Telekom · Turkcell · Vodafone</p></aside></section>
<div class="guide-layout"><article class="guide-content"><section id="paylasim-adimlari"><p class="eyebrow">ÜÇ ADIMDA BAŞLAYIN</p><h2>Sınırsız paylaşım modu nasıl açılır?</h2><ol class="install-steps"><li><h3>Telefonunuzdan interneti paylaşın.</h3><div>Mobil verinizi ve mobil erişim noktanızı (hotspot) açın. Kullanmak istediğiniz bilgisayarı, Android telefonu veya tableti bu Wi-Fi ağına bağlayın.</div></li><li><h3>Bağlanan cihaza DPI Bypass kurun.</h3><div>Örneğin interneti tabletinize paylaşıyorsanız Android uygulamasını tablete kurun. Bilgisayara paylaşıyorsanız Windows veya Linux sürümünü bilgisayarda kullanın.</div></li><li><h3>Ayarlardan paylaşım modunu açın.</h3><div>Uygulamadaki <strong>Vodafone Sınırsız Modu</strong> seçeneğini etkinleştirin. Windows’ta DNS ve ayarlar, Linux’ta Ayarlar → Gelişmiş bölümündedir. Ağ kaydı istenirse telefonunuzun erişim noktası ağını kaydedin. Durum bilgisinden modun bu bağlantıda etkin olduğunu kontrol edin.</div></li></ol></section>
<section class="guide-details"><h2>Android telefona veya tablete paylaşım</h2><p>Mobil erişim noktasına bağlanan Android 12 ve üzeri cihazda DPI Bypass APK’sını kurun. Uygulamayı açıp gerekli yerel VPN iznini verin ve ayarlardan paylaşım modunu etkinleştirin.</p><p><a href="/android/">Android APK indirme ve kurulum rehberi →</a></p><h2>Windows veya Linux bilgisayara paylaşım</h2><p>Bilgisayarı telefonun Wi-Fi erişim noktasına bağlayın. DPI Bypass’ı açıp Vodafone Sınırsız Modu’nu etkinleştirin. Ağ kurallarını uygulayabilmek için yönetici izni gerekir.</p><p><a href="/windows/">Windows rehberi</a> · <a href="/linux/">Linux rehberi</a></p><h2>Hangi mobil paketlerle kullanılabilir?</h2><p>Türk Telekom, Turkcell veya Vodafone’daki uyumlu sınırsız paketlerde kullanılabilir. Uygulamadaki özellik adı Vodafone Sınırsız Modu’dur. Uyumluluk ve sonuç, tarifeye, operatörün paylaşım politikasına ve cihazın ağ davranışına bağlıdır.</p><p>Bu özellik yeni bir internet paketi oluşturmaz; mevcut mobil bağlantınızın paylaşımında çalışır. Her sınırsız paket için aynı sonucu garanti etmez.</p></section>
<section class="guide-faq"><h2>Paylaşım hakkında sorular</h2>${faq([
  ['Uygulamayı hangi cihaza kurmalıyım?', '<p>İnterneti mobil erişim noktasından alan cihaza kurun. Tablete paylaşıyorsanız tablete, bilgisayara paylaşıyorsanız bilgisayara kurmanız gerekir.</p>'],
  ['Yalnızca Vodafone için mi?', '<p>Uygulamadaki adı Vodafone Sınırsız Modu’dur. Uyumlu Türk Telekom ve Turkcell paketlerinde de kullanılabilir; operatör ve paket bazında sonuç değişebilir.</p>'],
  ['Mod açık ama çalışmıyor; neyi kontrol edeyim?', '<p>Cihazın doğru erişim noktasına bağlı olduğundan, uygulamanın güncel olduğundan ve modun bu ağda etkin göründüğünden emin olun. PC’de yönetici izni ve ağ kaydı gerekebilir. Tarifenizin paylaşım koşullarını da kontrol edin.</p>']
])}</section></article><aside class="guide-sidebar"><h2>Cihazınız için indirin</h2>${platforms.map(p => `<a href="/${p.id}/">${icon(p.id)}<span>${p.name} rehberi</span>${icon('arrow')}</a>`).join('')}<p>En güncel sürüm bağlantıları ve cihazınıza özel kurulum adımları.</p></aside></div>
</main>${end()}`;
}

writeFileSync(path.join(root, 'index.html'), home());
for (const platform of platforms) {
  mkdirSync(path.join(root, platform.id), { recursive: true });
  writeFileSync(path.join(root, platform.id, 'index.html'), platformPage(platform));
}
mkdirSync(path.join(root, 'sinirsiz-paylasim'), { recursive: true });
writeFileSync(path.join(root, 'sinirsiz-paylasim/index.html'), sharingPage());
const routes = ['/', '/android/', '/windows/', '/linux/', '/sinirsiz-paylasim/'];
writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${site}${route}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
writeFileSync(path.join(root, '404.html'), `${head('Sayfa bulunamadı — DPI Bypass', 'Aradığınız sayfa bulunamadı. DPI Bypass ana sayfasından uygulamalar ve kurulum rehberlerine ulaşabilirsiniz.', '/').replace('index, follow, max-image-preview:large', 'noindex, follow')}<body>${header()}<main id="main" class="container section"><p class="eyebrow">404 · SAYFA BULUNAMADI</p><h1>Burada bir sayfa yok.</h1><p>Uygulamalar ve kurulum rehberleri için ana sayfaya dönebilirsiniz.</p><a class="button button-primary" href="/">Ana sayfaya dön ${icon('arrow')}</a></main>${end()}`);
console.log(`Rendered ${routes.length} static pages for ${site}, asset version ${assetVersion}`);
