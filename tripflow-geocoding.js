/**
 * TripFlow - Script de Géocodage Nominatim
 * Approche hybride : Nominatim + Fallback destination
 */

const API_BASE = 'https://tripflow-api.youssef-amrouche.workers.dev';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

const COUNTRY_NAMES = {
  'philippines': 'Philippines',
  'thailande': 'Thailand',
  'vietnam': 'Vietnam',
  'bali': 'Indonesia',
  'indonesie': 'Indonesia'
};

const DELAY_MS = 1100;

let stats = { total: 0, found: 0, notFound: 0, fallback: 0, errors: 0 };

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function geocodeNominatim(poiName, destinationName, countryName) {
  const query = `${poiName}, ${destinationName}, ${countryName}`;
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`;
  
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'TripFlow-Travel-App/1.0' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), source: 'nominatim' };
    }
    return null;
  } catch (error) {
    console.error(`  ⚠️ Erreur: ${error.message}`);
    return null;
  }
}

async function fetchAllPOIs() {
  console.log('📥 Récupération des POI...');
  const response = await fetch(`${API_BASE}/api/pois?limit=2000`);
  const data = await response.json();
  // Gérer les deux formats possibles: tableau direct ou objet avec propriété
  const pois = Array.isArray(data) ? data : (data.pois || data.data || []);
  console.log(`   ✅ ${pois.length} POI récupérés\n`);
  return pois;
}

async function fetchAllDestinations() {
  console.log('📥 Récupération des destinations...');
  const response = await fetch(`${API_BASE}/api/destinations`);
  const data = await response.json();
  // Gérer les deux formats possibles
  const destinations = Array.isArray(data) ? data : (data.destinations || data.data || []);
  console.log(`   ✅ ${destinations.length} destinations récupérées\n`);
  return destinations;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   TripFlow - Géocodage Nominatim (Approche Hybride)');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const pois = await fetchAllPOIs();
  const destinations = await fetchAllDestinations();
  
  if (!pois.length || !destinations.length) {
    console.log('❌ Erreur: Impossible de récupérer les données');
    return;
  }
  
  const destIndex = {};
  destinations.forEach(d => { destIndex[d.id] = d; });
  
  const poisToGeocode = pois.filter(p => !p.lat || !p.lng);
  console.log(`📍 POI à géocoder: ${poisToGeocode.length}\n`);
  
  if (poisToGeocode.length === 0) {
    console.log('✅ Tous les POI ont déjà des coordonnées !');
    return;
  }
  
  stats.total = poisToGeocode.length;
  const sqlUpdates = [];
  
  console.log('🔍 Début du géocodage (~' + Math.round(poisToGeocode.length / 60) + ' minutes)...\n');
  
  for (let i = 0; i < poisToGeocode.length; i++) {
    const poi = poisToGeocode[i];
    const dest = destIndex[poi.destination_id];
    
    if (!dest) {
      console.log(`❌ [${i+1}/${stats.total}] ${poi.name} - Destination inconnue`);
      stats.errors++;
      continue;
    }
    
    const countryName = COUNTRY_NAMES[dest.country] || dest.country;
    
    process.stdout.write(`🔍 [${i+1}/${stats.total}] ${poi.name.substring(0, 30).padEnd(30)} `);
    
    const result = await geocodeNominatim(poi.name, dest.name, countryName);
    
    if (result) {
      console.log(`✅ ${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}`);
      sqlUpdates.push(`UPDATE pois SET lat = ${result.lat}, lng = ${result.lng} WHERE id = '${poi.id}';`);
      stats.found++;
    } else {
      if (dest.lat && dest.lng) {
        const offsetLat = (Math.random() - 0.5) * 0.02;
        const offsetLng = (Math.random() - 0.5) * 0.02;
        const fallbackLat = dest.lat + offsetLat;
        const fallbackLng = dest.lng + offsetLng;
        
        console.log(`📍 Fallback → ${dest.name}`);
        sqlUpdates.push(`UPDATE pois SET lat = ${fallbackLat}, lng = ${fallbackLng} WHERE id = '${poi.id}';`);
        stats.fallback++;
      } else {
        console.log(`❌ Pas de coordonnées`);
        stats.notFound++;
      }
    }
    
    await sleep(DELAY_MS);
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   RÉSULTATS');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`📊 Total:            ${stats.total}`);
  console.log(`✅ Précis:           ${stats.found} (${Math.round(stats.found/stats.total*100)}%)`);
  console.log(`📍 Fallback:         ${stats.fallback} (${Math.round(stats.fallback/stats.total*100)}%)`);
  console.log(`❌ Non trouvés:      ${stats.notFound}`);
  
  if (sqlUpdates.length > 0) {
    const fs = require('fs');
    fs.writeFileSync('tripflow-geocoding-updates.sql', sqlUpdates.join('\n'));
    console.log(`\n💾 SQL sauvegardé: tripflow-geocoding-updates.sql (${sqlUpdates.length} requêtes)`);
  }
  
  console.log('\n✅ Terminé !');
}

main().catch(console.error);
