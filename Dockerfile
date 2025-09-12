#? --- Stage 1. Build the Node.js frontend
#? ---------------------------------------
FROM node:24.8-slim AS frontend_builder
WORKDIR /www/polimerbeton

COPY package.json package-lock.json /www/polimerbeton/
RUN npm install --omit=dev

#? --- Stage 2. Build the Django backend
#? -------------------------------------
FROM python:3.13-slim AS backend_builder
WORKDIR /www/polimerbeton

RUN pip install poetry
COPY pyproject.toml poetry.lock /www/polimerbeton/

RUN poetry config virtualenvs.in-project true \
    && poetry install --no-root

#? --- Stage 3. Execute "production" scenario for Polimerbeton
#? -----------------------------------------------------------
FROM python:3.13-slim AS production
WORKDIR /www/polimerbeton

# Create a non-root user
ARG user=django
ARG group=django
ARG uid=1000
ARG gid=1000

RUN groupadd -g ${gid} ${group} && useradd -u ${uid} -g ${group} -s /bin/sh -m ${user}

# Copy installed dependencies from builder stage
COPY --from=frontend_builder /www/polimerbeton/node_modules /www/polimerbeton/node_modules
COPY --from=backend_builder /www/polimerbeton/.venv /www/polimerbeton/.venv

# Copy application code
COPY . .

# Set ownership to the non-root user
RUN chown -R ${uid}:${gid} /www/polimerbeton

# Activate virtual environment
ENV PATH="/www/polimerbeton/.venv/bin:/www/polimerbeton/node_modules/.bin:$PATH"

# Install Gunicorn
# RUN pip install gunicorn

# Set environment variables
ENV PYTHONUNBUFFERED="1" \
    PYTHONDONTWRITEBYTECODE="1" \
    SITE_ID="1" \
    DJANGO_DEBUG="True" \
    DJANGO_SECRET_KEY="xmtx4h605s!y$tynvkbb6^s3%gfpnsvo2^eu5map9BUGABUGAacw%jmuz1284-18dfgjsdj120SKDAKJFJ$*$%@%!Qkls!" \
    DJANGO_ALLOWED_HOSTS="*" \
    DJANGO_SETTINGS_MODULE="config.settings.development" \
    POSTGRES_DB="polimerbeton-db" \
    POSTGRES_USER="dummy-guy" \
    POSTGRES_PASSWORD="(vo23022002va)" \
    POSTGRES_HOST="database--postgres" \
    POSTGRES_PORT="5432" \
    EMAIL_HOST_USER="tidoff-studio@yandex.ru" \
    EMAIL_HOST_PASSWORD="wlvclhejfedoeocxv" \
    EMAIL_RECIPIENT="tidoff-studio@yandex.ru" \
    FIELD_ENCRYPTION_KEY="a6aNtwbW7Hs5WnmP_x2qOzqrnD_Hzb9tfiUUuLwMHMs=" \
    COMPRESS_OFFLINE="True"

# Run Django commands
RUN python manage.py migrate
RUN python manage.py collectstatic --noinput
RUN python manage.py compress

EXPOSE 8000

USER ${uid}:${gid}

# Run Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]