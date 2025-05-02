# Matrix Operations Microservices

Este proyecto implementa un sistema de microservicios para operaciones matriciales, específicamente la factorización QR y análisis estadístico de matrices. El sistema está construido utilizando una arquitectura de microservicios con dos servidores Node.js independientes y una base de datos PostgreSQL.

## Arquitectura del Sistema

### Componentes Principales
- **Server One**: Servidor principal para operaciones de factorización QR
- **Server Two**: Servidor para análisis estadístico de matrices
- **PostgreSQL**: Base de datos para almacenamiento persistente
- **Docker**: Contenedorización y orquestación de servicios

### Tecnologías Utilizadas
- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Docker & Docker Compose
- Jest (Testing)

## Estructura del Proyecto

```
TodoListBeginner/
├── server-one/              # Servidor principal de factorización QR
│   ├── src/
│   ├── prisma/
│   └── Dockerfile
├── server-two/              # Servidor de análisis estadístico
│   ├── src/
│   ├── prisma/
│   └── Dockerfile
└── docker-compose.yml       # Configuración de servicios
```

## Ciclo de Vida de las APIs e Interacción entre Servicios

### Flujo de Operaciones
1. **Inicio del Cliente**
   - El cliente envía una matriz al Server One para factorización QR
   - Endpoint: `POST http://localhost:3000/api/v1/server-1/creation-matrix/qr-factorization`

2. **Server One (Factorización QR)**
   - Recibe la matriz de entrada
   - Realiza la factorización QR
   - Almacena los resultados en la base de datos
   - Envía los resultados al Server Two para análisis estadístico

3. **Server Two (Análisis Estadístico)**
   - Recibe los resultados de la factorización
   - Calcula estadísticas (máximo, mínimo, promedio, etc.)
   - Almacena los resultados en la base de datos
   - Retorna las estadísticas al Server One

4. **Respuesta Final**
   - Server One combina los resultados
   - Envía la respuesta completa al cliente

### Modelos de Datos

#### Tabla `matrix`
```sql
CREATE TABLE "matrix" (
    "id" SERIAL NOT NULL,
    "original" JSONB NOT NULL,
    "rotated" JSONB NOT NULL,
    "qMatrix" JSONB NOT NULL,
    "rMatrix" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabla `matrix_stats`
```sql
CREATE TABLE "matrix_stats" (
    "id" SERIAL NOT NULL,
    "original" JSONB NOT NULL,
    "rotated" JSONB NOT NULL,
    "qMatrix" JSONB NOT NULL,
    "rMatrix" JSONB NOT NULL,
    "maxValue" DOUBLE PRECISION NOT NULL,
    "minValue" DOUBLE PRECISION NOT NULL,
    "average" DOUBLE PRECISION NOT NULL,
    "totalSum" DOUBLE PRECISION NOT NULL,
    "isDiagonal" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL
);
```

#### Tabla `user`
```sql
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "refreshToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
```

#### Tabla `role`
```sql
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);
```

#### Relaciones
```sql
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" 
FOREIGN KEY ("roleId") REFERENCES "role"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;
```

## Configuración y Despliegue

### Prerrequisitos
- Docker y Docker Compose
- Node.js (para desarrollo local)
- PostgreSQL (para desarrollo local)

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/marcocruzado/matrix-endpoint-challenge
cd matrix-endpoint-challenge
```

2. Configurar variables de entorno:
   - Crear archivo `.env` en server-one y server-two:
```env
# server-one/.env
DATABASE_URL="postgresql://postgres:localhost_password@localhost:5432/matrix_db?schema=public"
PORT=3000
PREFIX_API=/api/v1/server-1
URL_SERVER_TWO=http://matrix_server_two:3001/api/v1/server-2/matrix-stats/stadistics
URL_FRONTEND=http://localhost:4200

SECRET_KEY=tu_clave_secreta
EXPIRATION_TIME=3600
ALGORITHM=HS256
SALT_ROUNDS=10
REFRESH_TOKEN_EXPIRATION=604800

# server-two/.env
PORT=3001
DATABASE_URL="postgresql://postgres:localhost_password@postgres:5432/matrix_db?schema=public"
PREFIX_API=/api/v1/server-2
URL_FRONTEND=http://localhost:4200
```

3. Iniciar los servicios:
```bash
docker compose up --build
```

## Uso de la API

### Endpoint Principal

```bash
curl --location 'http://localhost:3000/api/v1/server-1/creation-matrix/qr-factorization' \
--header 'Content-Type: application/json' \
--data '{
  "matrix": [
    [13, 22, 3],
    [4, 53, 6],
    [7, 8, 9]
  ]
}'
```

### Respuesta Ejemplo
```json
{
  "original": [[13, 22, 3], [4, 53, 6], [7, 8, 9]],
  "qMatrix": [...],
  "rMatrix": [...],
  "stats": {
    "maxValue": 53,
    "minValue": 3,
    "average": 13.89,
    "totalSum": 125,
    "isDiagonal": false
  }
}
```

# PROJECTO WEB Front-End

- paso 1: instalar angular cli
```bash
npm install -g @angular/cli
```

- paso 2: crear un nuevo proyecto angular
```bash
ng new matrix-frontend
```
- paso 3: comando para crear la estructura de carpetas, con las mejores practicas de desarrollo
```bash
cd matrix-frontend && mkdir -p src/app/{core,shared,features/{modulo-ejemplo/{components,services,store}}} src/assets src/environments src/styles
```
- TODO: agregar el archivo de estilos principales [POR FINALIZAR]

## Características Técnicas

### Manejo de Errores
- Validación de entrada con Celebrate/Joi
- Manejo centralizado de errores
- Logging detallado con ts-log-debug

### Seguridad
- Helmet para seguridad de cabeceras HTTP
- CORS configurado para endpoints específicos
- Validación de tipos con TypeScript

### Monitoreo y Logging
- Logs estructurados para debugging
- Morgan para logging de HTTP
- Métricas de rendimiento básicas

## Consideraciones de Desarrollo

### Patrones de Diseño
- Repository Pattern para acceso a datos
- Service Layer para lógica de negocio
- Controller Layer para manejo de HTTP
- Dependency Injection para mejor testabilidad

### Mejores Prácticas
- Clean Architecture
- SOLID Principles
- Error Handling centralizado
- Tipado fuerte con TypeScript
- Migraciones de base de datos automatizadas

## Troubleshooting

### Problemas Comunes
1. **Error de Conexión a la Base de Datos**
   - Verificar que PostgreSQL esté corriendo
   - Revisar credenciales en `.env`
   - Confirmar que las migraciones se ejecutaron

2. **Errores de CORS**
   - Verificar la configuración de CORS en ambos servidores
   - Asegurar que los orígenes permitidos estén correctamente configurados

3. **Problemas con Docker**
   - Limpiar contenedores e imágenes antiguas
   - Verificar los logs de Docker
   - Asegurar que los puertos no estén en uso

## Endpoints de Autenticación

### 1. Registro de Usuario
```bash
curl --location 'http://localhost:3000/api/v1/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "John",
    "lastName": "Doe",
    "email": "juan@example.com",
    "password": "123456",
    "documentType": "DNI",
    "documentNumber": "12345678",
    "roleId": 1,
    "status": "active",
    "nickName": "johndoe"
}'
```

### 2. Login
```bash
curl --location 'http://localhost:3000/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "juan@example.com",
    "password": "123456"
}'
```

### 3. Refresh Token
```bash
curl --location 'http://localhost:3000/api/v1/auth/refresh-token' \
--header 'Content-Type: application/json' \
--data-raw '{
    "refreshToken": "tu_refresh_token_aqui"
}'
```

## Respuestas Esperadas

### Registro y Login
```json
{
    "data": {
        "user": {
            "id": 1,
            "name": "John",
            "email": "juan@example.com",
            ...
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

### Refresh Token
```json
{
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

## Notas Importantes

1. El `accessToken` debe enviarse en el header `Authorization: Bearer <accessToken>` para las peticiones autenticadas
2. El `refreshToken` solo se usa para obtener nuevos `accessToken`
3. Si recibes un error 401, significa que el `accessToken` expiró y debes usar el `refreshToken` para obtener uno nuevo
4. Si el refresh token también expiró, recibirás un error y el usuario deberá volver a iniciar sesión 

## Flujo de Trabajo

### 1. Configuración Inicial
1. Clonar el repositorio
2. Configurar las variables de entorno en `server-one/.env`:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:localhost_password@localhost:5432/matrix_db?schema=public"
PREFIX_API=/api/v1/server-1
URL_FRONTEND=http://localhost:4200
SECRET_KEY=tu_clave_secreta
EXPIRATION_TIME=3600
ALGORITHM=HS256
SALT_ROUNDS=10
REFRESH_TOKEN_EXPIRATION=604800
```

### 2. Base de Datos
1. Iniciar PostgreSQL
2. Ejecutar las migraciones:
```bash
cd server-one
npx prisma migrate dev
```

### 3. Autenticación
1. **Configurar Roles por Defecto**
   - Ejecutar el siguiente comando para crear los roles por defecto:
   ```bash
   cd server-one
   npm run prisma:seed
   ```
   - Este comando creará automáticamente tres roles:
     - ADMIN (id: 1): Para administradores del sistema
     - USER (id: 2): Para usuarios regulares
     - GUEST (id: 3): Para usuarios con acceso limitado

2. **Registrar un Usuario**
   ```bash
   curl --location 'http://localhost:3000/api/v1/auth/register' \
   --header 'Content-Type: application/json' \
   --data-raw '{
       "name": "John",
       "lastName": "Doe",
       "email": "juan@example.com",
       "password": "123456",
       "documentType": "DNI",
       "documentNumber": "12345678",
       "roleId": 2,  # 2 corresponde al rol USER
       "status": "active",
       "nickName": "johndoe"
   }'
   ```

3. **Iniciar Sesión**
   ```bash
   curl --location 'http://localhost:3000/api/v1/auth/login' \
   --header 'Content-Type: application/json' \
   --data-raw '{
       "email": "juan@example.com",
       "password": "123456"
   }'
   ```
   - Guardar el `accessToken` y `refreshToken` recibidos

### 4. Operaciones con Matrices
1. **Autenticar Peticiones**
   - Usar el `accessToken` en el header de todas las peticiones:
   ```
   Authorization: Bearer <accessToken>
   ```

2. **Realizar Operaciones con Matrices**
   ```bash
   curl --location 'http://localhost:3000/api/v1/server-1/creation-matrix/qr-factorization' \
   --header 'Authorization: Bearer <accessToken>' \
   --header 'Content-Type: application/json' \
   --data '{
     "matrix": [
       [13, 22, 3],
       [4, 53, 6],
       [7, 8, 9]
     ]
   }'
   ```

### 5. Manejo de Tokens
1. **Cuando el Access Token Expira**
   - Si recibes un error 401, usar el refresh token:
   ```bash
   curl --location 'http://localhost:3000/api/v1/auth/refresh-token' \
   --header 'Content-Type: application/json' \
   --data-raw '{
       "refreshToken": "tu_refresh_token_aqui"
   }'
   ```
   - Usar el nuevo access token recibido

2. **Si el Refresh Token Expira**
   - El usuario debe volver a iniciar sesión con email y password

### 6. Desarrollo Frontend
1. **Configurar Angular**
   ```bash
   npm install -g @angular/cli
   ng new matrix-frontend
   ```

2. **Estructura de Carpetas**
   ```bash
   cd matrix-frontend
   mkdir -p src/app/{core,shared,features/{auth,matrix/{components,services,store}}} src/assets src/environments src/styles
   ```

3. **Implementar Autenticación**
   - Crear servicios para login/registro
   - Implementar interceptores para manejar tokens
   - Crear guards para rutas protegidas

4. **Implementar Operaciones con Matrices**
   - Crear componentes para entrada de matrices
   - Implementar servicios para comunicación con el backend
   - Mostrar resultados y estadísticas

### 7. Pruebas
1. **Probar Autenticación**
   - Verificar registro de usuarios
   - Probar login/logout
   - Comprobar renovación de tokens

2. **Probar Operaciones**
   - Verificar factorización QR
   - Comprobar cálculos estadísticos
   - Validar manejo de errores

### 8. Despliegue
1. **Backend**
   ```bash
   docker compose up --build
   ```

2. **Frontend**
   ```bash
   ng build --prod
   ```

## Consideraciones de Seguridad
1. Nunca compartir las claves secretas
2. Mantener los tokens seguros
3. Usar HTTPS en producción
4. Implementar rate limiting
5. Validar todas las entradas 