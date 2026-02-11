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
    freetype-dev \
    nginx \
    supervisor

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
# Build limpo
# ---------------------------
RUN rm -rf vendor \
    && composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-progress

# ---------------------------
# Permissões Laravel
# ---------------------------
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache

# ---------------------------
# Configuração Nginx
# ---------------------------
COPY nginx.conf /etc/nginx/http.d/default.conf

# ---------------------------
# Configuração Supervisor
# ---------------------------
RUN echo "[supervisord]" > /etc/supervisord.conf && \
    echo "nodaemon=true" >> /etc/supervisord.conf && \
    echo "" >> /etc/supervisord.conf && \
    echo "[program:php-fpm]" >> /etc/supervisord.conf && \
    echo "command=php-fpm -F" >> /etc/supervisord.conf && \
    echo "autostart=true" >> /etc/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisord.conf && \
    echo "stdout_logfile=/dev/stdout" >> /etc/supervisord.conf && \
    echo "stdout_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "stderr_logfile=/dev/stderr" >> /etc/supervisord.conf && \
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "" >> /etc/supervisord.conf && \
    echo "[program:nginx]" >> /etc/supervisord.conf && \
    echo "command=nginx -g 'daemon off;'" >> /etc/supervisord.conf && \
    echo "autostart=true" >> /etc/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisord.conf && \
    echo "stdout_logfile=/dev/stdout" >> /etc/supervisord.conf && \
    echo "stdout_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "stderr_logfile=/dev/stderr" >> /etc/supervisord.conf && \
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
