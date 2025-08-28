DELIMITER //
CREATE PROCEDURE RegistrarConsumo(
    IN p_estudiante_id INT,
    IN p_tipo_servicio_id INT,
    IN p_hash_huella TEXT
)
BEGIN
    DECLARE v_count INT DEFAULT 0;
    DECLARE v_hora_actual TIME;
    DECLARE v_hora_inicio TIME;
    DECLARE v_hora_fin TIME;
    DECLARE v_servicio_activo BOOLEAN DEFAULT FALSE;
    
    SET v_hora_actual = CURTIME();
    
    SELECT hora_inicio, hora_fin, activo 
    INTO v_hora_inicio, v_hora_fin, v_servicio_activo
    FROM tipos_servicio 
    WHERE id = p_tipo_servicio_id;
    
    IF NOT v_servicio_activo THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El tipo de servicio no está activo';
    END IF;
    
    IF v_hora_actual < v_hora_inicio OR v_hora_actual > v_hora_fin THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Fuera del horario de servicio';
    END IF;
    
    SELECT COUNT(*) INTO v_count
    FROM registros_consumo
    WHERE estudiante_id = p_estudiante_id 
    AND tipo_servicio_id = p_tipo_servicio_id 
    AND fecha_consumo = CURDATE();
    
    IF v_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El estudiante ya registró este servicio hoy';
    END IF;
    
    INSERT INTO registros_consumo (estudiante_id, tipo_servicio_id, fecha_consumo, hash_huella_usado)
    VALUES (p_estudiante_id, p_tipo_servicio_id, CURDATE(), p_hash_huella);
    
    SELECT 'Consumo registrado exitosamente' as mensaje;
END //
DELIMITER ;