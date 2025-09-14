#? --- Stage 1. Build the Node.js frontend
#? ---------------------------------------
FROM node:24.8-slim AS frontend_builder
WORKDIR /www/polimerbeton

COPY package.json package-lock.json /www/polimerbeton/
RUN npm install

#? --- Stage 2. Build the Django backend
#? -------------------------------------
FROM python:3.13-slim AS backend_builder
WORKDIR /www/polimerbeton

RUN pip install poetry
COPY pyproject.toml poetry.lock /www/polimerbeton/

RUN poetry config virtualenvs.create false \
    && poetry install --no-root --with dev
    
#? --- Stage 3. Execute "development" scenario for Polimerbeton
#? -----------------------------------------------------------
FROM python:3.13-slim AS development
WORKDIR /www/polimerbeton

# Setup environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBEFFERED=1 \
    PATH="/www/polimerbeton/node_modules/.bin:$PATH"
    
# Install system dependencies
RUN apt-get update && \
    apt-get install -y netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

# Copy installed dependencies from "builders" stage
COPY --from=frontend_builder /www/polimerbeton/node_modules /www/polimerbeton/node_modules
COPY --from=backend_builder /usr/local /usr/local

# Copy and setup entrypoint.sh
COPY ./scripts/entrypoint.sh /www/polimerbeton/scripts/
RUN sed -i 's/\r$//g' /www/polimerbeton/scripts/entrypoint.sh
RUN chmod +x /www/polimerbeton/scripts/entrypoint.sh

# Copy project
COPY . .

# Run entrypoint.sh
ENTRYPOINT ["/www/polimerbeton/scripts/entrypoint.sh"]