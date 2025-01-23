#!/bin/bash

# Activate virtual environment
source .venv/bin/activate

# Create and run Django migrations
echo "Creating migrations..."
python manage.py makemigrations
echo "Running migrations..."
python manage.py migrate

# Start Django server
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000 