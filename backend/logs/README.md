# Sistema de Logs

Esta carpeta almacena todos los registros del sistema. Los archivos se crean automáticamente.

## Estructura de logs:
- `application.log` - Logs generales de la aplicación
- `error.log` - Errores y excepciones
- `audit.log` - Registros de auditoría y seguridad
- `database.log` - Consultas y operaciones de base de datos

## Rotación de logs:
Los logs se rotan automáticamente cada día y se conservan por 30 días.