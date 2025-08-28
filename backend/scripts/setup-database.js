const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('✅ Conectado al servidor MySQL');

    await connection.execute('CREATE DATABASE IF NOT EXISTS sistema_alimentario CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Base de datos creada o ya existente');

    await connection.execute('USE sistema_alimentario');
    console.log('✅ Usando base de datos sistema_alimentario');

    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement + ';');
      }
    }
    console.log('✅ Esquema de base de datos ejecutado correctamente');

    const dataPath = path.join(__dirname, '../database/initial-data.sql');
    if (fs.existsSync(dataPath)) {
      const dataSQL = fs.readFileSync(dataPath, 'utf8');
      const dataStatements = dataSQL.split(';').filter(stmt => stmt.trim().length > 0);
      
      for (const statement of dataStatements) {
        if (statement.trim()) {
          await connection.execute(statement + ';');
        }
      }
      console.log('✅ Datos iniciales insertados');
    }

    await connection.end();
    console.log('🚀 Base de datos configurada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error.message);
    process.exit(1);
  }
}

setupDatabase();