import { philippinesPOI } from './philippines';
import { thailandePOI } from './thailande';
import { vietnamPOI } from './vietnam';
import { baliPOI } from './bali';

export const POI_DATA = {
  philippines: philippinesPOI,
  thailande: thailandePOI,
  vietnam: vietnamPOI,
  bali: baliPOI,
};

// Categories Lonely Planet
export const CATEGORIES = [
  { id: 'incontournables', label: 'Incontournables', color: '#dc2626', icon: 'star' },
  { id: 'voir', label: 'Voir', color: '#16a34a', icon: 'eye' },
  { id: 'activites', label: 'Activités', color: '#16a34a', icon: 'activity' },
  { id: 'seLoger', label: 'Se loger', color: '#16a34a', icon: 'bed' },
  { id: 'seRestaurer', label: 'Se restaurer', color: '#16a34a', icon: 'utensils' },
  { id: 'prendreUnVerre', label: 'Prendre un verre', color: '#16a34a', icon: 'glass' },
];

// Obtenir tous les POI d'une destination par categorie
export const getPOIByCategory = (country, destination, category) => {
  return POI_DATA[country]?.[destination]?.[category] || [];
};

// Obtenir tous les POI d'une destination (toutes categories)
export const getAllPOIForDestination = (country, destination) => {
  const destData = POI_DATA[country]?.[destination];
  if (!destData) return [];
  
  const allPOI = [];
  CATEGORIES.forEach(cat => {
    const pois = destData[cat.id] || [];
    pois.forEach(poi => {
      allPOI.push({ ...poi, categoryId: cat.id, categoryLabel: cat.label, categoryColor: cat.color });
    });
  });
  return allPOI;
};

// Compter tous les POI
export const getAllPOICount = () => {
  let count = 0;
  Object.values(POI_DATA).forEach(country => {
    Object.values(country).forEach(dest => {
      CATEGORIES.forEach(cat => {
        count += (dest[cat.id] || []).length;
      });
    });
  });
  return count;
};
