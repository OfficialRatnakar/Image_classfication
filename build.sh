#!/usr/bin/env bash
# Exit on error
set -o errexit

# Move to the backend directory
cd backend

# Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Make migrations and migrate
python manage.py makemigrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input 