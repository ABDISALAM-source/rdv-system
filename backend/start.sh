#!/usr/bin/env sh
set -eu

cd /app

mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache
chmod -R 775 storage bootstrap/cache || true

php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

php artisan migrate --force

exec php -S 0.0.0.0:${PORT:-10000} -t public
