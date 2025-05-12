#!/bin/bash

set -e

cd backend

echo "Testing OpenCV installation..."
python test_opencv.py

echo "Checking database connection..."
python -c "
import sys
import time
import django
from django.db import connections
from django.db.utils import OperationalError

django.setup()
retry_count = 0
max_retries = 5
connection_successful = False

while not connection_successful and retry_count < max_retries:
    try:
        connections['default'].ensure_connection()
        connection_successful = True
        print('Database connection successful')
    except OperationalError:
        retry_count += 1
        print(f'Database connection attempt {retry_count} of {max_retries} failed')
        if retry_count < max_retries:
            time.sleep(5)
        else:
            sys.exit(1)
"

# Apply migrations
echo "Applying database migrations..."
python manage.py migrate

# Pre-load TensorFlow model in the background to avoid startup timeouts
echo "Pre-loading TensorFlow model in the background..."
(python -c "
import tensorflow as tf
import ssl
# SSL certificate necessary for downloading weights
ssl._create_default_https_context = ssl._create_unverified_context
print('Loading InceptionResNetV2 model...')
model = tf.keras.applications.InceptionResNetV2(weights='imagenet')
print('TensorFlow model loaded successfully')
" &)

# Get the PORT environment variable or use 8000 as default
PORT=${PORT:-10000}
echo "Port set to: $PORT"

# Start the application
echo "Starting the application on port $PORT..."
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --log-level debug --timeout 120 --workers 1 