FROM node:18-slim

WORKDIR /app

# Instalar netcat y las dependencias necesarias
RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY start.sh ./

RUN chmod +x start.sh
RUN npm install
RUN npm run prisma:generate

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["sh", "./start.sh"] 