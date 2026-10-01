# DPI Bypass — Resmî indirme sitesi

**[dpi.atomland.xyz](https://dpi.atomland.xyz)** · Android, Windows ve Linux için
ücretsiz, açık kaynak DPI Bypass uygulamaları.

Sade açık/koyu tema, telefon ve tablet uyumu, klavyeyle kullanılabilen indirme
penceresi ve platformlara özel kurulum rehberleri. HTML, CSS ve JavaScript ile
çalışır; yayına almak için Node, paket kurulumu veya derleme gerekmez.

## Sayfalar

| Adres | İçerik |
| --- | --- |
| `/` | Uygulama tanıtımı, platform seçimi ve kısa sorular |
| `/android/` | Android APK, telefon ve tablet kurulumu |
| `/windows/` | Windows 10 / 11 kurulumu |
| `/linux/` | Linux dağıtımları, kurulum komutu ve gereksinimler |
| `/sinirsiz-paylasim/` | Mobil erişim noktasında paylaşım modu |

## Her zaman güncel indirmeler

- Android: `ATOMGAMERAGA/DPI-Bypass-Android` deposunun son kararlı APK dosyası.
  Eski `DPI-Bypass-DC` deposu bu ada taşınmıştır.
- Windows: `ATOMGAMERAGA/DPI-Bypass-Windows` deposunun son kararlı Setup EXE dosyası.
- Linux: resmî depodaki güncel `main/install.sh` betiği.

İndirme penceresi açıldığında GitHub Releases API sorgulanır; dosya adı veya sürüm
elle sabitlenmez. Taslak, ön sürüm ve debug dosyaları seçilmez. İstek zaman aşımına
uğrarsa, API limiti dolarsa veya uygun dosya bulunamazsa düğme resmî
`releases/latest` sayfasını açar. JavaScript olmadan platform rehberleri ve GitHub
bağlantıları kullanılabilir.

## İçeriği düzenlemek

Sayfaların ortak şablonu ve metinleri `scripts/build-site.mjs` içinde tutulur.
CSS ve tarayıcı davranışları `assets/css/style.css` ve `assets/js/` içindedir.

```powershell
node scripts/build-site.mjs
```

Bu komut beş HTML sayfasını, 404 sayfasını, sitemap ve robots dosyalarını üretir.
Üretilmiş dosyalar Git'e eklenir; Docker sadece bu statik dosyaları sunar.
CSS/JS değiştiğinde komutu tekrar çalıştırın: içerik hash'i içeren varlık URL'leri,
eski tarayıcı önbelleğinin yeni tasarımı gizlemesini önler.

Sosyal paylaşım görselinin kaynağı `assets/img/social.svg`, yayın dosyası
`assets/img/social.png` (1200×630) şeklindedir. İsteğe bağlı geliştirme aracı:
`sharp` kurulu bir ortamda `node scripts/render-social.cjs`.

## Yerel önizleme ve kontrol

```powershell
python -m http.server 4173 --bind 127.0.0.1
# http://127.0.0.1:4173
```

```powershell
node --test --test-isolation=none tests/downloads.test.cjs
python scripts/check-site.py
git diff --check
```

Testler cihaz algılamasını, son sürüm dosyası seçimini, bağlantı hatalarını ve
zaman aşımını doğrular. Site kontrolü tüm iç bağlantıları, dosyaları, sayfa
başlıklarını, canonical adreslerini, JSON-LD ve sitemap içeriğini doğrular.

## SEO ve yayın

Her sayfanın özgün başlığı, açıklaması ve canonical adresi vardır. Platform
sayfaları `SoftwareApplication` ve `BreadcrumbList` yapılandırılmış verilerini
içerir. İçerik JavaScript beklemeden HTML içinde okunabilir. Sitemap:
**https://dpi.atomland.xyz/sitemap.xml**.

Google Search Console'da `dpi.atomland.xyz` alan adını doğrulayıp sitemap'i
gönderin. İndeksleme ve arama performansını oradan takip edebilirsiniz. Sıralama
garantisi yoktur; yararlı içerik, site performansı ve proje bilinirliği de etkilidir.

Nginx bilinmeyen adresleri gerçek HTTP 404 ile yanıtlar. HTML ve sitemap yeniden
doğrulanır; sürümlenen varlıklar önbelleklenir. Docker / Dokploy kurulumu:
[DOKPLOY.md](DOKPLOY.md).

Tasarım ve SEO referansları:
[NN/g görsel hiyerarşi](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/),
[web.dev responsive tasarım](https://web.dev/learn/design/),
[Google SEO başlangıç rehberi](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

Yapımcı: **Atom Gamer Arda A.G.A** · Lisans: [GPL-3.0](LICENSE).
