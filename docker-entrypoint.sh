#!/bin/bash

set -e

cd backend

# Apply migrations
echo "Applying database migrations..."
python manage.py migrate

# Start the application
echo "Starting the application..."
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT 