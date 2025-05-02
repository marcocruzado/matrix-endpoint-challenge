# Microservicios de Operaciones Matriciales

Sistema de microservicios para factorización QR y análisis estadístico de matrices.

## Arquitectura

- **Servidor Uno (Puerto 3000)**: Factorización QR y autenticación
- **Servidor Dos (Puerto 3001)**: Análisis estadístico
- **PostgreSQL**: Base de datos
- **Docker**: Contenedorización

## Endpoints

### Servidor Uno (http://localhost:3000/api/v1/server-1)
- **Autenticación**:
  - `POST /auth/register` - Registro
  - `POST /auth/login` - Inicio de sesión
  - `POST /auth/refresh-token` - Renovar token
- **Matrices**:
  - `POST /creation-matrix/qr-factorization` - Factorización QR

### Servidor Dos (http://localhost:3001/api/v1/server-2)
- **Estadísticas**:
  - `POST /matrix-stats/stadistics` - Análisis estadístico

## Flujo de Trabajo Detallado

### 1. Configuración Inicial

1. **Clonar el repositorio**:
```bash
git clone https://github.com/marcocruzado/matrix-endpoint-challenge
cd matrix-endpoint-challenge
```

2. **Configurar variables de entorno**:
```env
# server-one/.env
DATABASE_URL="postgresql://postgres:localhost_password@postgres:5432/matrix_db?schema=public"
PORT=3000
PREFIX_API=/api/v1/server-1
URL_SERVER_TWO=http://matrix_server_two:3001/api/v1/server-2/matrix-stats/stadistics

SECRET_KEY=<tu_clave_secreta>  
EXPIRATION_TIME=3600
ALGORITHM=HS256
SALT_ROUNDS=10
REFRESH_TOKEN_EXPIRATION=604800

# server-two/.env
DATABASE_URL="postgresql://postgres:localhost_password@postgres:5432/matrix_db?schema=public"
PORT=3001
PREFIX_API=/api/v1/server-2
URL_FRONTEND=http://localhost:4200
```

3. **Iniciar servicios**:
```bash
docker compose up --build
```

### 2. Registro y Autenticación

1. **Registrar un nuevo usuario**:
```bash
curl --location 'http://localhost:3000/api/v1/server-1/auth/register' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Juan",
    "lastName": "Pérez",
    "email": "juan@ejemplo.com",
    "password": "123456",
    "documentType": "DNI",
    "documentNumber": "12345678",
    "roleId": 2,
    "status": "active",
    "nickName": "juanperez"
}'
```

2. **Iniciar sesión**:
```bash
curl --location 'http://localhost:3000/api/v1/server-1/auth/login' \
--header 'Content-Type: application/json' \
--data '{
    "email": "juan@ejemplo.com",
    "password": "123456"
}'
```

Respuesta:
```json
{
    "data": {
        "user": {
            "id": 1,
            "name": "Juan",
            "email": "juan@ejemplo.com"
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

### 3. Operaciones con Matrices

1. **Realizar factorización QR**:
```bash
curl --location 'http://localhost:3000/api/v1/server-1/creation-matrix/qr-factorization' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIs...' \
--header 'Content-Type: application/json' \
--data '{
    "matrix": [
        [13, 22, 3],
        [4, 53, 6],
        [7, 8, 9]
    ]
}'
```

2. **Proceso interno**:
   - Servidor Uno recibe la matriz
   - Realiza la factorización QR
   - Envía resultados al Servidor Dos
   - Servidor Dos calcula estadísticas
   - Servidor Uno combina resultados

3. **Respuesta final**:
```json
{
    "original": [[13, 22, 3], [4, 53, 6], [7, 8, 9]],
    "qMatrix": [
        [0.866, -0.433, 0.250],
        [0.267, 0.901, -0.340],
        [0.467, 0.033, 0.884]
    ],
    "rMatrix": [
        [15.0, 25.0, 7.0],
        [0.0, 45.0, 3.0],
        [0.0, 0.0, 8.0]
    ],
    "stats": {
        "maxValue": 53,
        "minValue": 3,
        "average": 13.89,
        "totalSum": 125,
        "isDiagonal": false
    }
}
```

### 4. Manejo de Tokens

1. **Cuando el token expira**:
```bash
curl --location 'http://localhost:3000/api/v1/server-1/auth/refresh-token' \
--header 'Content-Type: application/json' \
--data '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}'
```

2. **Respuesta**:
```json
{
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

## Tecnologías

- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Docker
- JWT
- Celebrate/Joi
- Helmet
- CORS

## Estructura
```
matrix-endpoint-challenge/
├── server-one/              # Factorización QR
├── server-two/              # Análisis estadístico
└── docker-compose.yml
```

## Frontend (Angular)

1. **Instalar**:
```bash
npm install -g @angular/cli
ng new matrix-frontend
```

2. **Estructura**:
```bash
cd matrix-frontend
mkdir -p src/app/{core,shared,features/{auth,matrix/{components,services,store}}}
```
[] Frontend en desarrollo


## Seguridad

- Tokens JWT para autenticación
- Validación de entradas
- CORS configurado
- Helmet para cabeceras HTTP

## Consideraciones Importantes

1. **Autenticación**:
   - Siempre incluir el token en el header: `Authorization: Bearer <token>`
   - Renovar el token cuando expire
   - No compartir tokens

2. **Matrices**:
   - Deben ser cuadradas
   - Valores numéricos
   - Tamaño máximo recomendado: 10x10

3. **Errores Comunes**:
   - 401: Token expirado o inválido
   - 400: Matriz inválida
   - 500: Error interno del servidor 