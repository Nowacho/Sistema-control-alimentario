```markdown
# Sistema de Control Alimentario - Backend

Backend para sistema de control de desayuno y refrigerio escolar con autenticación biométrica.

## 🚀 Características

- API REST con Express.js y TypeScript
- Base de datos MySQL con pooling de conexiones
- Autenticación biométrica con hash seguro (bcrypt)
- Validación de datos con express-validator
- Sistema de logging completo
- Auditoría de operaciones

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración

1. Copiar el archivo de entorno:
```bash
copy .env.example .env
```

2. Configurar variables en `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=sistema_alimentario
PORT=3001
NODE_ENV=development
```

3. Configurar la base de datos:
```bash
npm run setup-db
```

## 📂 Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## ⭐ Endpoints de la API

### Estudiantes
- `GET /api/students` - Listar estudiantes
- `POST /api/students` - Crear estudiante

### Huellas Digitales
- `POST /api/fingerprints` - Registrar huella digital

### Consumos
- `POST /api/consumption/verify` - Verificar y registrar consumo
- `POST /api/consumption/manual` - Registro manual de consumo

### Reportes
- `GET /api/reports/daily` - Reporte diario de consumos
- `GET /api/reports/service-types` - Tipos de servicio disponibles

### Sistema
- `GET /api/health` - Estado del sistema

## 🪧 Estructura de la Base de Datos

### Tablas Principales
- `estudiantes` - Información de estudiantes
- `huellas_digitales` - Hashes de huellas digitales
- `tipos_servicio` - Servicios (desayuno, refrigerio)
- `registros_consumo` - Registros de consumo diario
- `auditoria` - Auditoría de cambios

### Vistas
- `vista_consumo_diario` - Consumos del día actual
- `vista_estudiantes_activos` - Estudiantes con huellas registradas

## 📊 Scripts de Utilidad

```bash
# Configurar base de datos
npm run setup-db

# Insertar datos de prueba
npm run seed-data

# Verificar estado del sistema
npm run health-check

# Limpiar datos antiguos
npm run cleanup-data

# Limpiar logs antiguos
npm run cleanup-logs
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration
```

## 📋 Logs

El sistema genera logs en la carpeta `logs/`:
- `application-YYYY-MM-DD.log` - Logs de aplicación
- `error-YYYY-MM-DD.log` - Errores del sistema
- `audit-YYYY-MM-DD.log` - Auditoría de operaciones
- `database-YYYY-MM-DD.log` - Consultas de base de datos

## 🔧 Estructura del Proyecto

```
src/
├── controllers/     # Controladores de endpoints
├── models/         # Interfaces TypeScript
├── services/       # Lógica de negocio
├── middleware/     # Middlewares de Express
├── routes/         # Definición de rutas
├── utils/          # Utilidades comunes
└── index.ts        # Punto de entrada
```

## 🛡️ Seguridad

- Hash de huellas digitales con bcrypt (salt rounds: 12)
- Validación de datos de entrada
- Pooling de conexiones a base de datos
- Logging de operaciones sensibles