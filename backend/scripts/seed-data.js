const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sistema_alimentario'
    });

    console.log('✅ Conectado a la base de datos');

    const students = [
      { numero_documento: '1000000001', nombres: 'Ana María', apellidos: 'García López', grado: '10', grupo: 'A' },
      { numero_documento: '1000000002', nombres: 'Carlos José', apellidos: 'Martínez Ruiz', grado: '10', grupo: 'B' },
      { numero_documento: '1000000003', nombres: 'María Fernanda', apellidos: 'Rodríguez Pérez', grado: '11', grupo: 'A' },
      { numero_documento: '1000000004', nombres: 'Juan Diego', apellidos: 'Hernández Gómez', grado: '11', grupo: 'B' },
      { numero_documento: '1000000005', nombres: 'Laura Sofia', apellidos: 'Díaz Castro', grado: '9', grupo: 'A' }
    ];

    console.log('📝 Insertando estudiantes de prueba...');
    for (const student of students) {
      await connection.execute(
        'INSERT IGNORE INTO estudiantes (numero_documento, nombres, apellidos, grado, grupo) VALUES (?, ?, ?, ?, ?)',
        [student.numero_documento, student.nombres, student.apellidos, student.grado, student.grupo]
      );
    }

    console.log('📝 Insertando consumos de prueba para hoy...');
    const [estudiantes] = await connection.execute('SELECT id FROM estudiantes');
    
    for (const estudiante of estudiantes) {
      const shouldHaveBreakfast = Math.random() > 0.3;
      const shouldHaveSnack = Math.random() > 0.4;
      
      if (shouldHaveBreakfast) {
        await connection.execute(
          'INSERT IGNORE INTO registros_consumo (estudiante_id, tipo_servicio_id, fecha_consumo, metodo_registro) VALUES (?, 1, CURDATE(), ?)',
          [estudiante.id, Math.random() > 0.5 ? 'huella_digital' : 'manual']
        );
      }
      
      if (shouldHaveSnack) {
        await connection.execute(
          'INSERT IGNORE INTO registros_consumo (estudiante_id, tipo_servicio_id, fecha_consumo, metodo_registro) VALUES (?, 2, CURDATE(), ?)',
          [estudiante.id, Math.random() > 0.5 ? 'huella_digital' : 'manual']
        );
      }
    }

    await connection.end();
    console.log('🌱 Datos de prueba insertados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error insertando datos de prueba:', error.message);
  }
}

seedData();