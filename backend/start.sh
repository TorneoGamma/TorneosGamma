#!/bin/bash
set -e

echo "=== Limpiando config ==="
php artisan config:clear

echo "=== Corriendo migraciones ==="
php artisan migrate --force

echo "=== Iniciando servidor en puerto $PORT ==="
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
