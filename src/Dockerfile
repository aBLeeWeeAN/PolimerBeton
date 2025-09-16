#? --- Stage 1. Build the Node.js frontend
#? ---------------------------------------
FROM node:24.8-slim AS frontend_builder
WORKDIR /usr/src/polimerbeton

COPY package.json package-lock.json /usr/src/polimerbeton/
RUN npm install

#? --- Stage 2. Build the Django backend
#? -------------------------------------
FROM python:3.13-slim AS backend_builder
WORKDIR /usr/src/polimerbeton

# Setup Python environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN pip install poetry
COPY pyproject.toml poetry.lock /usr/src/polimerbeton/

RUN poetry config virtualenvs.create false \
    && poetry install --no-root --with dev
    
#? --- Stage 3. Execute "development" scenario for Polimerbeton
#? -----------------------------------------------------------
FROM python:3.13-slim AS development

# create the appropriate directories
ENV HOME=/root \
    APP_HOME=/root/www/polimerbeton

RUN mkdir -p $APP_HOME
RUN mkdir -p $APP_HOME/scripts
RUN mkdir -p $APP_HOME/staticfiles

WORKDIR $APP_HOME

# Install system dependencies
RUN apt-get update && \
    apt-get install -y netcat-openbsd ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy Node.js runtime form frontend_builder
COPY --from=frontend_builder /usr/local/bin/node /usr/local/bin/

# Copy installed dependencies from "builders" stage (Node.js and Poetry)
COPY --from=frontend_builder /usr/src/polimerbeton/node_modules $APP_HOME/node_modules
COPY --from=backend_builder /usr/local /usr/local

# Setup Python environment variables
# and add Node.js dependencies BINs to PATH
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="$APP_HOME/node_modules/.bin:$PATH"

# Copy project
COPY . $APP_HOME

# Setup entrypoint.sh
RUN sed -i 's/\r$//g' $APP_HOME/scripts/entrypoint.sh && \
    chmod +x $APP_HOME/scripts/entrypoint.sh

# Run entrypoint.prod.sh
ENTRYPOINT ["/root/www/polimerbeton/scripts/entrypoint.sh"]