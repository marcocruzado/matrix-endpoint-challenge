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

## Configuración y Despliegue

### Prerrequisitos
- Docker y Docker Compose
- Node.js (para desarrollo local)
- PostgreSQL (para desarrollo local)

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd TodoListBeginner
```

2. Configurar variables de entorno:
   - Crear archivo `.env` en server-one y server-two:
```env
# server-one/.env
PORT=3000
DATABASE_URL="postgresql://postgres:localhost_password@postgres:5432/matrix_db?schema=public"

# server-two/.env
PORT=3001
DATABASE_URL="postgresql://postgres:localhost_password@postgres:5432/matrix_db?schema=public"
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