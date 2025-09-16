#!/bin/sh

# --- Ожидание запуска PostgreSQL ---
if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started!"
fi

# --- Django management commands ---
# echo "Delete old staticfiles..."
# rm -rf /home/warden/www/polimerbeton/staticfiles/* || true

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "Compressing assets..."
python manage.py compress

# --- Запуск основной команды контейнера ---
exec "$@"