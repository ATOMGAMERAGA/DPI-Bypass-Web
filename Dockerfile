# DPI Bypass — indirme sitesi
# Statik site, nginx ile servis edilir. Dokploy için hazır.
FROM nginx:1.27-alpine

# Varsayılan yapılandırmayı kendi yapılandırmamızla değiştir
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/site.conf

# Site dosyaları
COPY index.html /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY sitemap.xml 404.html /usr/share/nginx/html/
COPY windows/ /usr/share/nginx/html/windows/
COPY android/ /usr/share/nginx/html/android/
COPY linux/ /usr/share/nginx/html/linux/
COPY sinirsiz-paylasim/ /usr/share/nginx/html/sinirsiz-paylasim/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
