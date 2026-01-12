FROM php:8.2-fpm-alpine

# Dependências do sistema (Alpine)
RUN apk add --no-cache \
    bash \
    curl \
    git \
    icu-dev \
    libzip-dev \
    zlib-dev \
    oniguruma-dev \
    libxml2-dev \
    libpng-dev \
    jpeg-dev \
    freetype-dev \
    mysql-client \
    unzip \
    zip

# Extensões PHP (as que mais dão pau no composer)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_mysql \
    mbstring \
    bcmath \
    exif \
    pcntl \
    intl \
    zip \
    gd

WORKDIR /var/www

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copia o projeto
COPY . .

# Instala dependências do PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Permissões (Laravel)
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
