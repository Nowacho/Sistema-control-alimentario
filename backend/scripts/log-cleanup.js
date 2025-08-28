const fs = require('fs');
const path = require('path');

function cleanupLogs() {
  const logsDir = path.join(__dirname, '../logs');
  
  if (!fs.existsSync(logsDir)) {
    console.log('No hay logs para limpiar');
    return;
  }

  const files = fs.readdirSync(logsDir);
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

  let deletedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(logsDir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile() && stats.mtime < thirtyDaysAgo) {
      fs.unlinkSync(filePath);
      deletedCount++;
      console.log(`Eliminado: ${file}`);
    }
  });

  console.log(`✅ Limpieza completada. ${deletedCount} archivos eliminados.`);
}

cleanupLogs();