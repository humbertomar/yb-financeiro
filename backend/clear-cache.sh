#!/bin/sh

# Script para limpar cache do Laravel
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear

echo "Cache limpo com sucesso!"
