CREATE VIEW vista_consumo_diario AS
SELECT 
    e.numero_documento,
    CONCAT(e.nombres, ' ', e.apellidos) as nombre_completo,
    e.grado,
    e.grupo,
    ts.nombre as tipo_servicio,
    rc.fecha_consumo,
    rc.hora_registro,
    rc.metodo_registro
FROM registros_consumo rc
JOIN estudiantes e ON rc.estudiante_id = e.id
JOIN tipos_servicio ts ON rc.tipo_servicio_id = ts.id
WHERE rc.fecha_consumo = CURDATE()
ORDER BY rc.hora_registro DESC;

CREATE VIEW vista_estudiantes_activos AS
SELECT 
    e.id,
    e.numero_documento,
    CONCAT(e.nombres, ' ', e.apellidos) as nombre_completo,
    e.grado,
    e.grupo,
    COUNT(hd.id) as huellas_registradas
FROM estudiantes e
LEFT JOIN huellas_digitales hd ON e.id = hd.estudiante_id AND hd.activa = TRUE
WHERE e.activo = TRUE
GROUP BY e.id;