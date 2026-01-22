/**
 * TripFlow API Service
 * Fonctions pour appeler l'API Cloudflare Worker
 */

const API_BASE_URL = 'https://tripflow-api.youssef-amrouche.workers.dev';

/**
 * Fetch helper avec gestion d'erreurs
 */
async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

// ============================================
// DESTINATIONS
// ============================================

/**
 * Récupérer toutes les destinations
 * @param {string} country - Filtrer par pays (optionnel)
 */
export async function fetchDestinations(country = null) {
  const endpoint = country 
    ? `/api/destinations?country=${country}`
    : '/api/destinations';
  const data = await fetchAPI(endpoint);
  return data.destinations;
}

/**
 * Récupérer une destination avec tous ses POI
 * @param {string} id - ID de la destination (ex: "ubud")
 */
export async function fetchDestinationWithPOIs(id) {
  const data = await fetchAPI(`/api/destinations/${id}`);
  return data;
}

// ============================================
// POI (Points d'Intérêt)
// ============================================

/**
 * Récupérer les POI avec filtres
 * @param {Object} filters - Filtres optionnels
 * @param {string} filters.destination - ID destination
 * @param {string} filters.country - Pays
 * @param {string} filters.type - Type (activity, restaurant, hotel, bar)
 * @param {string} filters.category - Catégorie LP (incontournables, voir, activites, se_loger, se_restaurer, sortir)
 * @param {boolean} filters.family - Adaptés familles uniquement
 * @param {boolean} filters.mustSee - Incontournables uniquement
 */
export async function fetchPOIs(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.destination) params.append('destination', filters.destination);
  if (filters.country) params.append('country', filters.country);
  if (filters.type) params.append('type', filters.type);
  if (filters.category) params.append('category', filters.category);
  if (filters.family) params.append('family', 'true');
  if (filters.mustSee) params.append('must_see', 'true');
  if (filters.limit) params.append('limit', filters.limit);
  
  const queryString = params.toString();
  const endpoint = queryString ? `/api/pois?${queryString}` : '/api/pois';
  
  const data = await fetchAPI(endpoint);
  return data.pois;
}

/**
 * Récupérer un POI par son ID
 * @param {string} id - ID du POI
 */
export async function fetchPOI(id) {
  const data = await fetchAPI(`/api/pois/${id}`);
  return data;
}

/**
 * Récupérer les POI d'une destination
 * @param {string} destinationId - ID de la destination
 */
export async function fetchPOIsForDestination(destinationId) {
  return fetchPOIs({ destination: destinationId });
}

/**
 * Récupérer les POI incontournables
 */
export async function fetchMustSeePOIs() {
  return fetchPOIs({ mustSee: true });
}

/**
 * Récupérer les POI adaptés aux familles
 */
export async function fetchFamilyFriendlyPOIs() {
  return fetchPOIs({ family: true });
}

// ============================================
// RECHERCHE
// ============================================

/**
 * Rechercher dans les destinations et POI
 * @param {string} query - Terme de recherche (min 2 caractères)
 */
export async function searchAll(query) {
  if (!query || query.length < 2) {
    return { destinations: [], pois: [] };
  }
  const data = await fetchAPI(`/api/search?q=${encodeURIComponent(query)}`);
  return {
    destinations: data.results.destinations.items,
    pois: data.results.pois.items,
  };
}

// ============================================
// STATISTIQUES
// ============================================

/**
 * Récupérer les statistiques de la base
 */
export async function fetchStats() {
  const data = await fetchAPI('/api/stats');
  return data;
}

// ============================================
// HELPERS pour compatibilité avec le code existant
// ============================================

/**
 * Transformer les données API au format attendu par l'app
 * (pour compatibilité avec les fichiers JS existants)
 */
export function transformDestinationForApp(apiDestination) {
  return {
    id: apiDestination.id,
    name: apiDestination.name,
    country: apiDestination.country,
    region: apiDestination.region,
    description: apiDestination.description,
    lat: apiDestination.lat,
    lng: apiDestination.lng,
    image: apiDestination.image_url || `https://source.unsplash.com/800x600/?${apiDestination.name},travel`,
    familyFriendly: apiDestination.family_friendly === 1,
  };
}

export function transformPOIForApp(apiPOI) {
  return {
    id: apiPOI.id,
    destinationId: apiPOI.destination_id,
    destinationName: apiPOI.destination_name,
    country: apiPOI.country,
    name: apiPOI.name,
    type: apiPOI.type,
    category: apiPOI.category,
    description: apiPOI.description,
    lat: apiPOI.lat,
    lng: apiPOI.lng,
    price: apiPOI.price_level || '$',
    priceRange: apiPOI.price_range,
    familyFriendly: apiPOI.family_friendly === 1,
    mustSee: apiPOI.must_see === 1,
    tags: Array.isArray(apiPOI.tags) ? apiPOI.tags : [],
    address: apiPOI.address,
    phone: apiPOI.phone,
    website: apiPOI.website,
    openingHours: apiPOI.opening_hours,
    tips: apiPOI.tips,
  };
}

/**
 * Charger toutes les données pour l'app (destinations + POI)
 * Retourne un format compatible avec le code existant
 */
export async function loadAllData() {
  try {
    const [destinations, pois] = await Promise.all([
      fetchDestinations(),
      fetchPOIs({ limit: 1500 }),
    ]);
    
    // Transformer au format app
    const transformedDestinations = destinations.map(transformDestinationForApp);
    const transformedPOIs = pois.map(transformPOIForApp);
    
    // Grouper les POI par destination
    const poisByDestination = {};
    transformedPOIs.forEach(poi => {
      if (!poisByDestination[poi.destinationId]) {
        poisByDestination[poi.destinationId] = [];
      }
      poisByDestination[poi.destinationId].push(poi);
    });
    
    // Grouper les destinations par pays
    const destinationsByCountry = {};
    transformedDestinations.forEach(dest => {
      if (!destinationsByCountry[dest.country]) {
        destinationsByCountry[dest.country] = [];
      }
      destinationsByCountry[dest.country].push(dest);
    });
    
    return {
      destinations: transformedDestinations,
      destinationsByCountry,
      pois: transformedPOIs,
      poisByDestination,
      stats: {
        totalDestinations: destinations.length,
        totalPOIs: pois.length,
      },
    };
  } catch (error) {
    console.error('Failed to load data from API:', error);
    throw error;
  }
}

export default {
  fetchDestinations,
  fetchDestinationWithPOIs,
  fetchPOIs,
  fetchPOI,
  fetchPOIsForDestination,
  fetchMustSeePOIs,
  fetchFamilyFriendlyPOIs,
  searchAll,
  fetchStats,
  loadAllData,
  transformDestinationForApp,
  transformPOIForApp,
};
