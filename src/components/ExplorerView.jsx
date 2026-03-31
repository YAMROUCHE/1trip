import { useState, useMemo } from 'react';
import { Icon } from './ui';
import { MapView } from './Map';
import { COUNTRIES, DESTINATIONS } from '../data/config';
import { DESTINATION_INFO } from '../data/destinations';

const TYPES = [
  { id: 'all', name: 'Tous' },
  { id: 'attraction', name: '👁️ À voir' },
  { id: 'activity', name: '🎯 Activités' },
  { id: 'restaurant', name: '🍽️ Restos' },
  { id: 'hotel', name: '🏨 Hôtels' },
  { id: 'bar', name: '🍸 Bars' },
  { id: 'shopping', name: '🛍️ Shopping' },
];

const BUDGETS = [
  { id: 'all', name: 'Tous budgets' },
  { id: '$', name: '$' },
  { id: '$$', name: '$$' },
  { id: '$$$', name: '$$$' },
  { id: '$$$$', name: '$$$$' },
];

export function ExplorerView({ 
  apiData, 
  destinations, 
  onAddDestination, 
  onRemoveDestination,
  onToggleFavorite,
  isFavorite,
  getCountryColor
}) {
  const [country, setCountry] = useState('philippines');
  const [destination, setDestination] = useState(DESTINATIONS['philippines']?.[0] || 'el-nido');
  const [typeFilter, setTypeFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [familyOnly, setFamilyOnly] = useState(false);
  const [mustSeeOnly, setMustSeeOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Vérifier si une destination est dans le voyage
  const isInTrip = (destId) => destinations?.some(d => d.id === destId);

  // Charger les POIs
  const allPois = useMemo(() => {
    if (apiData?.poisByDestination?.[destination]) {
      return apiData.poisByDestination[destination];
    }
    return [];
  }, [apiData, destination]);

  // Filtrer les POIs
  const filteredPois = useMemo(() => {
    return allPois.filter(poi => {
      // Filtre type
      if (typeFilter !== 'all' && poi.type !== typeFilter) return false;
      
      // Filtre budget (price_range)
      if (budgetFilter !== 'all') {
        const price = poi.price_range || poi.price || '';
        if (price !== budgetFilter) return false;
      }
      
      // Filtre famille
      if (familyOnly && !poi.family_friendly && !poi.familyFriendly) return false;
      
      // Filtre incontournables (must_see OU type='incontournable')
      if (mustSeeOnly) {
        const isMustSee = poi.must_see || poi.mustSee || poi.type === 'incontournable';
        if (!isMustSee) return false;
      }
      
      // Filtre recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = (poi.name || '').toLowerCase();
        const desc = (poi.description || '').toLowerCase();
        if (!name.includes(query) && !desc.includes(query)) return false;
      }
      
      return true;
    });
  }, [allPois, typeFilter, budgetFilter, familyOnly, mustSeeOnly, searchQuery]);

  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
    setDestination(DESTINATIONS[newCountry]?.[0] || '');
  };

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Liste POIs */}
      <div style={{ width: '55%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb' }}>
        
        {/* Header avec pays et destinations */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
          {/* Pays */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {COUNTRIES.map(c => (
              <button 
                key={c.id} 
                onClick={() => handleCountryChange(c.id)}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '13px', 
                  fontWeight: 500, 
                  background: country === c.id ? getCountryColor(c.id) : '#f1f5f9', 
                  color: country === c.id ? 'white' : '#6b7280' 
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
          
          {/* Destinations */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {DESTINATIONS[country]?.map(d => {
              const info = DESTINATION_INFO[d];
              const inTrip = isInTrip(d);
              return (
                <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button 
                    onClick={() => setDestination(d)}
                    style={{ 
                      padding: '6px 14px', 
                      borderRadius: '20px', 
                      border: destination === d ? '2px solid #6366f1' : '1px solid #e5e7eb', 
                      cursor: 'pointer', 
                      fontSize: '13px', 
                      background: 'white', 
                      color: destination === d ? '#6366f1' : '#374151', 
                      fontWeight: destination === d ? 600 : 400 
                    }}
                  >
                    {info?.name || d}
                  </button>
                  <button 
                    onClick={() => inTrip ? onRemoveDestination(d) : onAddDestination(d)}
                    style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '11px', 
                      fontWeight: 500,
                      background: inTrip ? '#dcfce7' : '#14B8A6', 
                      color: inTrip ? '#166534' : 'white'
                    }}
                  >
                    {inTrip ? '✓' : '+'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Barre de recherche */}
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="🔍 Rechercher un lieu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Filtres Type */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: typeFilter === t.id ? '2px solid #6366f1' : '1px solid #e5e7eb',
                  background: typeFilter === t.id ? '#eef2ff' : 'white',
                  color: typeFilter === t.id ? '#6366f1' : '#6b7280',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: typeFilter === t.id ? 600 : 400
                }}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Filtres Budget + Toggles */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Budget */}
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              {BUDGETS.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {/* Toggle Famille */}
            <button
              onClick={() => setFamilyOnly(!familyOnly)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                border: familyOnly ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                background: familyOnly ? '#fef3c7' : 'white',
                color: familyOnly ? '#b45309' : '#6b7280',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: familyOnly ? 600 : 400
              }}
            >
              👨‍👩‍👦 Famille
            </button>

            {/* Toggle Incontournables */}
            <button
              onClick={() => setMustSeeOnly(!mustSeeOnly)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                border: mustSeeOnly ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                background: mustSeeOnly ? '#fef3c7' : 'white',
                color: mustSeeOnly ? '#b45309' : '#6b7280',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: mustSeeOnly ? 600 : 400
              }}
            >
              ⭐ Incontournables
            </button>

            {/* Compteur */}
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#6b7280' }}>
              {filteredPois.length} résultat{filteredPois.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Liste des POIs */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPois.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p>Aucun résultat avec ces filtres</p>
                <button 
                  onClick={() => {
                    setTypeFilter('all');
                    setBudgetFilter('all');
                    setFamilyOnly(false);
                    setMustSeeOnly(false);
                    setSearchQuery('');
                  }}
                  style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              filteredPois.map(poi => {
                const isMustSee = poi.must_see || poi.mustSee || poi.type === 'incontournable';
                const isFamily = poi.family_friendly || poi.familyFriendly;
                const isFav = isFavorite(poi.id);
                
                return (
                  <div 
                    key={poi.id} 
                    style={{ 
                      background: 'white', 
                      borderRadius: '10px', 
                      border: '1px solid #e5e7eb', 
                      padding: '16px', 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '14px' 
                    }}
                  >
                    <div style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '10px', 
                      background: poi.type === 'restaurant' ? '#fff7ed' : poi.type === 'hotel' ? '#f0fdf4' : poi.type === 'bar' ? '#fdf4ff' : '#eef2ff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <Icon name={poi.type === 'restaurant' ? 'utensils' : poi.type === 'hotel' ? 'bed' : poi.type === 'bar' ? 'wine' : 'pin'} size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>{poi.name}</span>
                        {isMustSee && <span style={{ color: '#f59e0b' }}>⭐</span>}
                        {isFamily && (
                          <span style={{ fontSize: '11px', padding: '2px 8px', background: '#fef3c7', borderRadius: '4px', color: '#b45309' }}>
                            Famille
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                        {poi.type} · {poi.price_range || poi.price || '$'}
                      </div>
                      <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.5, margin: 0 }}>
                        {poi.description}
                      </p>
                    </div>
                    <button 
                      onClick={() => onToggleFavorite(poi)} 
                      style={{ 
                        background: isFav ? '#fef3c7' : '#f1f5f9', 
                        border: 'none', 
                        borderRadius: '8px', 
                        padding: '10px', 
                        cursor: 'pointer', 
                        color: isFav ? '#f59e0b' : '#9ca3af' 
                      }}
                    >
                      <Icon name="star" size={18} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Carte */}
      <div style={{ width: '45%', position: 'relative' }}>
        <MapView 
          destination={destination} 
          pois={filteredPois} 
          selectedPOI={null} 
          onSelectPOI={() => {}} 
        />
      </div>
    </div>
  );
}

export default ExplorerView;
