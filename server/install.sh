#!/usr/bin/env bash
# Установка сайта на российский сервер (Ubuntu 22.04/24.04). Запускается от root.
#
# Переменные (передаёт tools/vps_deploy.mjs):
#   DOMAIN               — домен сайта, например olgatour.ru
#   LETSENCRYPT_EMAIL    — почта для сертификата
#   TELEGRAM_BOT_TOKEN   — токен бота для заявок (может быть пустым)
#   TELEGRAM_CHAT_ID     — id чатов через запятую
#   ARCHIVE              — путь к архиву сайта на сервере
#   SERVER_DIR           — папка с server.mjs на сервере
set -euo pipefail

: "${DOMAIN:?нужен DOMAIN}"
: "${ARCHIVE:?нужен ARCHIVE (архив сайта)}"
: "${SERVER_DIR:?нужен SERVER_DIR (папка с server.mjs)}"
EMAIL="${LETSENCRYPT_EMAIL:-admin@$DOMAIN}"
SITE=/opt/olgatour

echo "→ 1/8 пакеты"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq nginx nodejs certbot python3-certbot-nginx ufw >/dev/null

echo "→ 2/8 сайт в $SITE"
mkdir -p "$SITE/dist" "$SITE/server"
rm -rf "${SITE:?}/dist"/*
tar -xzf "$ARCHIVE" -C "$SITE/dist"
cp "$SERVER_DIR/server.mjs" "$SITE/server/server.mjs"
test -f "$SITE/dist/index.html" || { echo "в архиве нет index.html"; exit 1; }

echo "→ 3/8 настройки службы"
cat > /etc/olgatour.env <<ENV
SITE_ROOT=$SITE/dist
PORT=8787
HOST=127.0.0.1
TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID=$TELEGRAM_CHAT_ID
ENV
chmod 600 /etc/olgatour.env
chown -R www-data:www-data "$SITE"

echo "→ 4/8 служба приёма заявок"
cat > /etc/systemd/system/olgatour-api.service <<'UNIT'
[Unit]
Description=Приём заявок сайта «Личный турагент Ольга Дударева»
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/olgatour
EnvironmentFile=/etc/olgatour.env
ExecStart=/usr/bin/node /opt/olgatour/server/server.mjs
Restart=always
RestartSec=3
User=www-data
Group=www-data
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable --now olgatour-api
systemctl restart olgatour-api

echo "→ 5/8 конфигурация nginx"
mkdir -p /var/www/certbot
sed -e "s/DOMAIN/$DOMAIN/g" -e "s|SITE_ROOT|$SITE/dist|g" "$SERVER_DIR/nginx-olgatour.conf" \
  > /etc/nginx/sites-available/olgatour.conf
ln -sf /etc/nginx/sites-available/olgatour.conf /etc/nginx/sites-enabled/olgatour.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t

echo "→ 6/8 сертификат https"
systemctl reload nginx
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect || \
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect || \
  echo "  (сертификат не получен — проверьте, что домен уже указывает на этот сервер)"

echo "→ 7/8 брандмауэр"
ufw allow OpenSSH >/dev/null 2>&1 || true
ufw allow 80/tcp >/dev/null 2>&1 || true
ufw allow 443/tcp >/dev/null 2>&1 || true
ufw --force enable >/dev/null 2>&1 || true

echo "→ 8/8 проверка"
systemctl reload nginx
sleep 2
echo -n "  служба заявок: "; curl -s --max-time 10 http://127.0.0.1:8787/api/health || echo "нет ответа"
echo
echo -n "  сайт по https: "; curl -s -o /dev/null -w "%{http_code}\n" --max-time 15 "https://$DOMAIN/" || true
echo "готово"
