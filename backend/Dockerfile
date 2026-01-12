FROM php:8.2-fpm-alpine

# ---------------------------
# Dependências do sistema
# ---------------------------
RUN apk add --no-cache \
    bash \
    curl \
    git \
    unzip \
    zip \
    mysql-client \
    icu-dev \
    libzip-dev \
    zlib-dev \
    oniguruma-dev \
    libxml2-dev \
    libpng-dev \
    jpeg-dev \
    freetype-dev

# ---------------------------
# Extensões PHP (Laravel + deps)
# ---------------------------
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

# ---------------------------
# Diretório de trabalho
# ---------------------------
WORKDIR /var/www

# ---------------------------
# Composer
# ---------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ---------------------------
# Copia o projeto
# ---------------------------
COPY . .

# ---------------------------
# Build limpo (corrige seu erro)
# - Se por acaso veio vendor no repo/cache, remove
# - Instala do zero e gera autoload otimizado
# ---------------------------
RUN rm -rf vendor \
    && composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-progress

# ---------------------------
# Permissões Laravel
# ---------------------------
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
