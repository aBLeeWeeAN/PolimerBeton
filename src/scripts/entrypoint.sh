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

# Сбрасываем базу (для dev)
python manage.py flush --no-input

# Применяем миграции
python manage.py migrate

# --- Создание суперпользователя ---
# Используем переменные окружения:
# DJANGO_SUPERUSER_EMAIL
# DJANGO_SUPERUSER_USERNAME
# DJANGO_SUPERUSER_PASSWORD

python manage.py shell << END
from django.contrib.auth import get_user_model
import os

User = get_user_model()
email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

if username and email and password:
    if not User.objects.filter(username=username).exists():
        print("Creating Django superuser...")
        user = User.objects.create_superuser(username=username, email=email, password=password)
    else:
        print("Superuser already exists.")
END

# --- Запуск основной команды контейнера ---
exec "$@"