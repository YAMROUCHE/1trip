const fs = require('fs');

async function main() {
  // Lire le fichier SQL
  const sql = fs.readFileSync('updates.sql', 'utf8');
  const lines = sql.split('\n').filter(l => l.startsWith('UPDATE'));
  
  console.log(`📥 ${lines.length} requêtes à exécuter\n`);
  
  // Exécuter par lots de 50
  const BATCH_SIZE = 50;
  const API = 'https://tripflow-api.youssef-amrouche.workers.dev';
  
  for (let i = 0; i < lines.length; i += BATCH_SIZE) {
    const batch = lines.slice(i, i + BATCH_SIZE);
    const batchSQL = batch.join(' ');
    
    try {
      const response = await fetch(`${API}/api/execute-sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: batchSQL })
      });
      
      if (response.ok) {
        console.log(`✅ Lot ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(lines.length/BATCH_SIZE)} (${batch.length} requêtes)`);
      } else {
        console.log(`⚠️ Lot ${Math.floor(i/BATCH_SIZE) + 1} - Erreur API`);
      }
    } catch(e) {
      console.log(`❌ Lot ${Math.floor(i/BATCH_SIZE) + 1} - ${e.message}`);
    }
  }
  
  console.log('\n✅ Terminé!');
}

main();
