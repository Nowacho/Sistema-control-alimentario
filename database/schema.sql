CREATE TABLE estudiantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    grado VARCHAR(10) NOT NULL,
    grupo VARCHAR(5) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE huellas_digitales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT NOT NULL,
    hash_huella TEXT NOT NULL,
    dedo_registrado ENUM('pulgar_derecho', 'indice_derecho', 'medio_derecho', 'anular_derecho', 'meñique_derecho',
                        'pulgar_izquierdo', 'indice_izquierdo', 'medio_izquierdo', 'anular_izquierdo', 'meñique_izquierdo'),
    activa BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_finger (estudiante_id, dedo_registrado)
);

CREATE TABLE tipos_servicio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE registros_consumo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT NOT NULL,
    tipo_servicio_id INT NOT NULL,
    fecha_consumo DATE NOT NULL,
    hora_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_registro ENUM('huella_digital', 'manual') DEFAULT 'huella_digital',
    hash_huella_usado TEXT,
    observaciones TEXT,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_servicio_id) REFERENCES tipos_servicio(id),
    UNIQUE KEY unique_daily_service (estudiante_id, tipo_servicio_id, fecha_consumo)
);

CREATE TABLE auditoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tabla_afectada VARCHAR(50) NOT NULL,
    registro_id INT NOT NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    datos_anteriores JSON,
    datos_nuevos JSON,
    usuario VARCHAR(100),
    timestamp_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_estudiante_documento ON estudiantes(numero_documento);
CREATE INDEX idx_estudiante_nombres ON estudiantes(nombres, apellidos);
CREATE INDEX idx_registro_fecha ON registros_consumo(fecha_consumo);
CREATE INDEX idx_registro_estudiante_fecha ON registros_consumo(estudiante_id, fecha_consumo);
CREATE INDEX idx_huella_estudiante ON huellas_digitales(estudiante_id);