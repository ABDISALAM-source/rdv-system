FROM php:8.3-cli

WORKDIR /app

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    && docker-php-ext-install pdo_pgsql pgsql bcmath \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . /app

RUN mkdir -p /app/bootstrap/cache \
    /app/storage/framework/cache \
    /app/storage/framework/sessions \
    /app/storage/framework/views \
    /app/storage/logs \
    && chmod -R 775 /app/bootstrap/cache /app/storage

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
