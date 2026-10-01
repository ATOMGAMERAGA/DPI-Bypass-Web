# Dokploy ile yayına alma

Bu depo, Dokploy'da **hiçbir ek ayar yapmadan** yayına alınacak şekilde hazır:
kökte bir `Dockerfile` ve `nginx.conf` var. Dokploy `Dockerfile`'ı görüp imajı
kendisi derler, Traefik de alan adını ve HTTPS sertifikasını halleder.

Aşağıdaki adımlar Dokploy'un güncel arayüzüne göredir. Toplam süre ~5 dakika.

---

## 0. Ön koşullar

- Çalışan bir Dokploy kurulumu (VPS üzerinde, panel açılıyor).
- Bir alan adı (örn. `dpi.atomland.xyz`) ve DNS'ini yönetebilme.
- Dokploy'un GitHub hesabınıza bağlı olması (yoksa 1. adım).

---

## 1. GitHub'ı Dokploy'a bağlayın

> Depo herkese açıksa bu adımı atlayıp 3. adımda **Public repository (Git)**
> seçeneğiyle doğrudan URL verebilirsiniz.

1. Dokploy panelinde sol menüden **Settings → Git** (bazı sürümlerde
   **Settings → Providers**) açın.
2. **GitHub → Create GitHub App** deyin.
3. Açılan GitHub sayfasında uygulamayı oluşturun, sonra **Install** deyin ve
   `ATOMGAMERAGA/DPI-Bypass-Web` deposuna erişim verin.
4. Dokploy'a dönünce bağlantının **Connected** göründüğünü doğrulayın.

---

## 2. Proje oluşturun

1. **Projects → Create Project**.
2. Ad: `dpi-bypass` · Açıklama: `DPI Bypass indirme sitesi` → **Create**.

---

## 3. Uygulamayı (Application) ekleyin

1. Projenin içinde **Create Service → Application**.
2. Ad: `web` → **Create**.
3. Açılan servisin **General** sekmesinde:

   | Alan | Değer |
   | --- | --- |
   | **Provider** | `GitHub` |
   | **Repository** | `ATOMGAMERAGA/DPI-Bypass-Web` |
   | **Branch** | `main` |
   | **Build Path** | `/` |
   | **Build Type** | **Dockerfile** |
   | **Docker File** | `Dockerfile` |
   | **Docker Context Path** | boş (ya da `.`) |
   | **Docker Build Stage** | boş |

4. **Save**.

> **Docker File alanını boş bırakmayın.** Boş kalırsa Dokploy kod dizininin
> yolunu dosya adı sanar ve derleme şu hatayla düşer:
>
> ```
> #1 [internal] load build definition from code
> ERROR: failed to read dockerfile: open code: no such file or directory
> ```
>
> Alana `Dockerfile` yazıp kaydetmek yeterlidir.

> **Neden Nixpacks değil?** Nixpacks statik siteyi de derleyebilir ama sonuçta
> ne servis edeceğini tahmin etmeye çalışır. `Dockerfile` seçeneği ne olacağını
> tam olarak bu depodaki `nginx.conf` belirler: gzip, önbellek başlıkları,
> güvenlik başlıkları ve `/healthz` uç noktası hazır gelir.

---

## 4. Alan adı ve HTTPS

Önce DNS: alan adınız için Dokploy sunucunuzun IP'sine bir **A kaydı** açın.

```
Tip   Ad                       Değer
A     dpi                     <SUNUCU_IP>
```

> Cloudflare kullanıyorsanız sertifika alınana kadar bulut simgesini **gri**
> (DNS only) bırakın; sertifika geldikten sonra turuncuya çevirebilirsiniz.

Sonra Dokploy'da servisin **Domains** sekmesi → **Add Domain**:

| Alan | Değer |
| --- | --- |
| **Host** | `dpi.atomland.xyz` |
| **Path** | `/` |
| **Container Port** | `80` |
| **HTTPS** | açık |
| **Certificate** | `Let's Encrypt` |

**Create** deyin. Traefik sertifikayı birkaç saniye içinde alır.

> **Container Port mutlaka `80` olmalı** — imajın içindeki nginx bu portu
> dinliyor. Buraya 3000 ya da 8080 yazarsanız "Bad Gateway" alırsınız.

---

## 5. Yayına alın

Servisin sağ üstündeki **Deploy** düğmesine basın. **Logs** sekmesinden imajın
derlenişini canlı izleyebilirsiniz. Bitince alan adınızı açın — site yayında.

Kontrol için:

```bash
curl -I https://dpi.atomland.xyz          # 200 OK beklenir
curl  https://dpi.atomland.xyz/healthz    # "ok" döner
```

---

## 6. Otomatik dağıtım (isteğe bağlı ama önerilir)

Servisin **Deployments** sekmesinde **Webhook URL** bulunur. Bunu GitHub'da
**Settings → Webhooks → Add webhook** ile ekleyin:

- **Payload URL:** Dokploy'un verdiği adres
- **Content type:** `application/json`
- **Events:** `Just the push event`

Artık seçili dala her `git push` yaptığınızda site kendiliğinden yeniden
derlenip yayına alınır.

Alternatif olarak Dokploy'un **Auto Deploy** anahtarını açmanız da yeterlidir
(GitHub App bağlıysa webhook'u kendisi kurar).

---

## Sorun giderme

| Belirti | Sebep / çözüm |
| --- | --- |
| **502 / Bad Gateway** | Domain ayarındaki **Container Port** `80` değil. Düzeltip yeniden dağıtın. |
| **Sertifika gelmiyor** | DNS A kaydı henüz yayılmamış ya da Cloudflare proxy'si açık. `dig dpi.atomland.xyz` ile IP'yi doğrulayın, proxy'yi gri yapın, **Deploy**'u tekrarlayın. |
| **Eski içerik görünüyor** | Tarayıcı önbelleği. `/assets/` 30 gün önbelleklenir, `index.html` önbelleklenmez — sert yenileme (Ctrl+Shift+R) yeterlidir. |
| **`failed to read dockerfile: open code: no such file or directory`** | **Docker File** alanı boş. `Dockerfile` yazıp kaydedin, sonra yeniden dağıtın. |
| **Build "Dockerfile not found" diyor** | **Build Path** `/` ve **Docker File** `Dockerfile` olmalı. |
| **Push ettim, site değişmedi** | Auto Deploy kapalı ya da webhook yanlış dalı dinliyor. Servisin **Branch** alanıyla push ettiğiniz dalın aynı olduğunu doğrulayın. |
| **Site açılıyor ama düğmeler çalışmıyor** | `assets/js/app.js` 404 veriyordur. Tarayıcı konsolunu açıp yolu doğrulayın; `Dockerfile` içindeki `COPY assets/` satırının durduğundan emin olun. |

---

## Sonradan sürüm güncellemek

Android ve Windows indirmeleri GitHub Releases API ile son kararlı dosyayı bulur.
Yeni uygulama sürümü çıktığında site bağlantılarını elle güncellemek gerekmez.
Linux kurulum komutu resmî deponun güncel `main/install.sh` betiğini kullanır.

Site metinlerini veya CSS/JS dosyalarını değiştirdiğinizde `node scripts/build-site.mjs`
çalıştırın ve üretilmiş HTML dosyalarını da push edin. Bu işlem CSS/JS adreslerine
önbelleği yenileyen içerik hash'ini ekler. Otomatik dağıtım açıksa Dokploy değişikliği
yayına alır.

## Google indekslemesi

Google Search Console'da `dpi.atomland.xyz` alan adını doğrulayın ve
`https://dpi.atomland.xyz/sitemap.xml` adresini gönderin. Sitemap ana sayfayı,
Android, Windows, Linux ve sınırsız paylaşım rehberlerini içerir.
