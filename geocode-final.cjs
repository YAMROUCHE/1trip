const fs = require('fs');
const API = 'https://tripflow-api.youssef-amrouche.workers.dev';
const NOM = 'https://nominatim.openstreetmap.org/search';
const COUNTRIES = { 'philippines': 'Philippines', 'thailande': 'Thailand', 'vietnam': 'Vietnam', 'bali': 'Indonesia' };
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const pois = await fetch(`${API}/api/pois?limit=2000`).then(r => r.json()).then(d => d.pois || d);
  const dests = await fetch(`${API}/api/destinations`).then(r => r.json()).then(d => d.destinations || d);
  const destMap = Object.fromEntries(dests.map(d => [d.id, d]));
  
  console.log(`🚀 ${pois.length} POI à traiter (~20 min)\n`);
  
  fs.writeFileSync('updates.sql', '-- Geocoding TripFlow\n');
  
  let found = 0;
  for (let i = 0; i < pois.length; i++) {
    const poi = pois[i];
    const dest = destMap[poi.destination_id];
    if (!dest) continue;
    
    process.stdout.write(`[${i+1}/${pois.length}] ${poi.name.substring(0,28).padEnd(28)} `);
    
    const url = `${NOM}?q=${encodeURIComponent(poi.name + ', ' + dest.name + ', ' + (COUNTRIES[dest.country]||dest.country))}&format=json&limit=1`;
    let lat, lng, status;
    
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'TripFlow/1.0' } });
      const data = await res.json();
      if (data?.[0]) {
        lat = parseFloat(data[0].lat);
        lng = parseFloat(data[0].lon);
        status = '✅';
        found++;
      } else {
        lat = dest.lat + (Math.random() - 0.5) * 0.01;
        lng = dest.lng + (Math.random() - 0.5) * 0.01;
        status = '📍';
      }
    } catch(e) {
      lat = dest.lat + (Math.random() - 0.5) * 0.01;
      lng = dest.lng + (Math.random() - 0.5) * 0.01;
      status = '⚠️';
    }
    
    fs.appendFileSync('updates.sql', `UPDATE pois SET lat=${lat}, lng=${lng} WHERE id='${poi.id}';\n`);
    console.log(`${status} ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    
    await sleep(1100);
  }
  
  console.log(`\n✅ Terminé! ${found} précis sur ${pois.length}`);
  console.log(`📄 Fichier: updates.sql`);
}

main();
