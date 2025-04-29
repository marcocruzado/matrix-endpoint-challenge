#!/bin/sh

# Esperar a que la base de datos esté lista
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Esperar un poco más para asegurarnos que las migraciones del server-one hayan terminado
echo "Waiting for migrations to complete..."
sleep 10

# Iniciar la aplicación
echo "Starting the application..."
npm run start:prod 