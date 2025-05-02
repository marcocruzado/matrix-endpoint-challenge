#!/bin/sh

# Esperar a que la base de datos esté lista
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Ejecutar migraciones
echo "Running database migrations..."
npx prisma migrate reset --force
npx prisma migrate deploy

# Ejecutar el seeder
echo "Running database seed..."
npm run prisma:seed

# Iniciar la aplicación
echo "Starting the application..."
npm run start:prod 