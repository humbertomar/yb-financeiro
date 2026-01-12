FROM php:8.2-fpm-alpine

# Dependências
RUN apk add --no-cache \
    bash \
    curl \
    libpng \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    mysql-client

# Extensões PHP
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

WORKDIR /var/www

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear

RUN chown -R www-data:www-data /var/www

EXPOSE 9000

CMD ["php-fpm"]
