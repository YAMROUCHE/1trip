/**
 * useAPI Hook
 * Hook React pour charger et gérer les données depuis l'API TripFlow
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  loadAllData, 
  fetchPOIsForDestination, 
  searchAll,
  fetchDestinationWithPOIs 
} from '../services/api';

/**
 * Hook principal pour charger toutes les données au démarrage
 */
export function useAPIData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const result = await loadAllData();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Failed to load API data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading, error };
}

/**
 * Hook pour charger les POI d'une destination spécifique
 */
export function useDestinationPOIs(destinationId) {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!destinationId) {
      setPois([]);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        const result = await fetchPOIsForDestination(destinationId);
        setPois(result);
        setError(null);
      } catch (err) {
        console.error(`Failed to load POIs for ${destinationId}:`, err);
        setError(err.message);
        setPois([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [destinationId]);

  return { pois, loading, error };
}

/**
 * Hook pour charger une destination avec ses POI
 */
export function useDestination(destinationId) {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!destinationId) {
      setDestination(null);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        const result = await fetchDestinationWithPOIs(destinationId);
        setDestination(result);
        setError(null);
      } catch (err) {
        console.error(`Failed to load destination ${destinationId}:`, err);
        setError(err.message);
        setDestination(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [destinationId]);

  return { destination, loading, error };
}

/**
 * Hook pour la recherche
 */
export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ destinations: [], pois: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (searchQuery) => {
    setQuery(searchQuery);
    
    if (!searchQuery || searchQuery.length < 2) {
      setResults({ destinations: [], pois: [] });
      return;
    }

    try {
      setLoading(true);
      const result = await searchAll(searchQuery);
      setResults(result);
      setError(null);
    } catch (err) {
      console.error('Search failed:', err);
      setError(err.message);
      setResults({ destinations: [], pois: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  return { query, results, loading, error, search };
}

/**
 * Hook helper pour obtenir les POI par destination depuis les données chargées
 */
export function usePOIsByDestination(data, destinationId) {
  if (!data || !destinationId) return [];
  return data.poisByDestination[destinationId] || [];
}

/**
 * Hook helper pour filtrer les POI
 */
export function useFilteredPOIs(pois, filters = {}) {
  const [filteredPOIs, setFilteredPOIs] = useState([]);

  useEffect(() => {
    if (!pois || pois.length === 0) {
      setFilteredPOIs([]);
      return;
    }

    let result = [...pois];

    // Filtre par type
    if (filters.type && filters.type !== 'all') {
      result = result.filter(poi => poi.type === filters.type);
    }

    // Filtre par catégorie
    if (filters.category && filters.category !== 'all') {
      result = result.filter(poi => poi.category === filters.category);
    }

    // Filtre famille
    if (filters.familyOnly) {
      result = result.filter(poi => poi.familyFriendly);
    }

    // Filtre incontournables
    if (filters.mustSeeOnly) {
      result = result.filter(poi => poi.mustSee);
    }

    // Recherche texte
    if (filters.searchQuery && filters.searchQuery.length >= 2) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(poi => 
        poi.name.toLowerCase().includes(query) ||
        (poi.description && poi.description.toLowerCase().includes(query)) ||
        (poi.tags && poi.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Tri
    if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'mustSee') {
      result.sort((a, b) => (b.mustSee ? 1 : 0) - (a.mustSee ? 1 : 0));
    }

    setFilteredPOIs(result);
  }, [pois, filters]);

  return filteredPOIs;
}

export default {
  useAPIData,
  useDestinationPOIs,
  useDestination,
  useSearch,
  usePOIsByDestination,
  useFilteredPOIs,
};
