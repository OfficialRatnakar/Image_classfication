FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt file
COPY backend/requirements.txt /tmp/requirements.txt

# Clean up any potential BOM or special characters in the requirements file
RUN sed -i 's/\r//g' /tmp/requirements.txt && \
    tr -d '\uFEFF' < /tmp/requirements.txt > /tmp/clean_requirements.txt

# Install pip dependencies
RUN pip install --upgrade pip && \
    pip install -r /tmp/clean_requirements.txt

# Copy the rest of the application
COPY . .

# Environment variables for Django
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings

# Collect static files - run only during build
RUN cd backend && python manage.py collectstatic --noinput

# Don't run migrations during build, will run during startup
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 8000

# Start command
ENTRYPOINT ["/docker-entrypoint.sh"] 