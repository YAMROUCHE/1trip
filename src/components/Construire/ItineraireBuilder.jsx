import { useState } from 'react';
import { Icon } from '../ui';
import { DestinationCard } from './DestinationCard';
import { COUNTRIES, DESTINATIONS } from '../../data/config';
import { DESTINATION_INFO } from '../../data/destinations';
import { PRECONISATIONS } from '../../data/preconisations';

const TRANSPORT_TYPES = [
  { id: 'avion', label: 'Avion', icon: 'plane' },
  { id: 'bus', label: 'Bus', icon: 'bus' },
  { id: 'train', label: 'Train', icon: 'train' },
  { id: 'ferry', label: 'Ferry', icon: 'ship' },
  { id: 'bateau', label: 'Bateau rapide', icon: 'ship' },
  { id: 'van', label: 'Van/Minibus', icon: 'bus' },
  { id: 'voiture', label: 'Voiture', icon: 'car' },
  { id: 'scooter', label: 'Scooter', icon: 'bike' },
];

const getCountryInfo = (countryId) => {
  return COUNTRIES.find(c => c.id === countryId);
};

const COUNTRY_COLORS = {
  philippines: '#3b82f6',
  thailande: '#ef4444',
  vietnam: '#eab308',
  bali: '#22c55e'
};

export function ItineraireBuilder({ 
  etapes, 
  onAddEtape, 
  onUpdateEtape, 
  onRemoveEtape,
  onReorderEtapes,
  apiData
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('all');

  const addedDestinations = etapes.map(e => e.destination_id);

  // Utiliser les destinations de l'API (40 destinations) avec fallback local
  const getAllDestinations = () => {
    if (apiData?.destinations && apiData.destinations.length > 0) {
      return apiData.destinations
        .filter(d => !addedDestinations.includes(d.id))
        .map(d => ({
          id: d.id,
          countryId: d.country,
          name: d.name,
          description: d.description,
          image: DESTINATION_INFO[d.id]?.image || `https://source.unsplash.com/800x600/?${encodeURIComponent(d.name)},travel`,
          days: DESTINATION_INFO[d.id]?.days || 3,
          poiCount: d.poi_count || 0
        }));
    }
    
    // Fallback sur les données locales (14 destinations)
    const allDests = [];
    Object.entries(DESTINATIONS).forEach(([countryId, destIds]) => {
      destIds.forEach(destId => {
        if (!addedDestinations.includes(destId)) {
          const info = DESTINATION_INFO[destId];
          if (info) {
            allDests.push({
              id: destId,
              countryId,
              name: info.name,
              image: info.image,
              days: info.days,
              poiCount: 0
            });
          }
        }
      });
    });
    return allDests;
  };

  const availableDestinations = getAllDestinations().filter(
    d => selectedCountry === 'all' || d.countryId === selectedCountry
  );

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newEtapes = [...etapes];
    const draggedItem = newEtapes[draggedIndex];
    newEtapes.splice(draggedIndex, 1);
    newEtapes.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    onReorderEtapes(newEtapes);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const totalNuits = etapes.reduce((sum, e) => sum + e.nb_nuits, 0);
  const totalHebergement = etapes.reduce((sum, e) => sum + (e.hebergement_prix * e.nb_nuits), 0);
  const totalTransport = etapes.reduce((sum, e) => sum + (e.transport_cout || 0), 0);

  // Compter les destinations par pays depuis l'API
  const getCountryCount = (countryId) => {
    if (apiData?.destinations) {
      return apiData.destinations.filter(d => d.country === countryId && !addedDestinations.includes(d.id)).length;
    }
    return 0;
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Destinations</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#111827' }}>{etapes.length}</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Nuits</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#111827' }}>{totalNuits}</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Hébergements</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#6366f1' }}>{totalHebergement.toLocaleString()}€</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Transports</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#6366f1' }}>{totalTransport.toLocaleString()}€</div>
        </div>
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 20px',
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          marginBottom: 24
        }}
      >
        <Icon name="plus" size={18} />
        Ajouter une destination
      </button>

      {etapes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: 12, border: '2px dashed #e5e7eb' }}>
          <Icon name="map" size={48} style={{ color: '#d1d5db', marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Aucune destination</h3>
          <p style={{ color: '#6b7280', marginBottom: 20 }}>Commencez par ajouter des destinations à votre itinéraire</p>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ padding: '10px 20px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
          >
            + Ajouter ma première destination
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {etapes.map((etape, index) => (
            <DestinationCard
              key={etape.id}
              etape={etape}
              index={index}
              onUpdate={(updates) => onUpdateEtape(etape.id, updates)}
              onRemove={() => onRemoveEtape(etape.id)}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              isDragging={draggedIndex === index}
              transportTypes={TRANSPORT_TYPES}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: 16, width: '90%', maxWidth: 800, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Ajouter une destination</h2>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0 0' }}>{availableDestinations.length} destinations disponibles</p>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', backgroundColor: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="x" size={18} />
              </button>
            </div>

            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setSelectedCountry('all')} 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: 20, 
                    border: 'none', 
                    backgroundColor: selectedCountry === 'all' ? '#6366f1' : '#f3f4f6', 
                    color: selectedCountry === 'all' ? 'white' : '#374151', 
                    fontSize: 13, 
                    fontWeight: 500, 
                    cursor: 'pointer' 
                  }}
                >
                  Tous ({apiData?.destinations?.filter(d => !addedDestinations.includes(d.id)).length || 0})
                </button>
                {COUNTRIES.map(country => (
                  <button 
                    key={country.id} 
                    onClick={() => setSelectedCountry(country.id)} 
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: 20, 
                      border: 'none', 
                      backgroundColor: selectedCountry === country.id ? COUNTRY_COLORS[country.id] : '#f3f4f6', 
                      color: selectedCountry === country.id ? 'white' : '#374151', 
                      fontSize: 13, 
                      fontWeight: 500, 
                      cursor: 'pointer' 
                    }}
                  >
                    {country.name} ({getCountryCount(country.id)})
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
              {availableDestinations.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>Toutes les destinations de ce pays ont été ajoutées</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {availableDestinations.map(dest => {
                    const countryInfo = getCountryInfo(dest.countryId);
                    const preco = PRECONISATIONS[dest.id];

                    return (
                      <button
                        key={dest.id}
                        onClick={() => { onAddEtape(dest.id); setShowAddModal(false); }}
                        style={{ padding: 0, backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 12, cursor: 'pointer', textAlign: 'left', overflow: 'hidden', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <div style={{ height: 80, backgroundImage: `url(${dest.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: 8, left: 8, padding: '3px 8px', backgroundColor: COUNTRY_COLORS[dest.countryId], color: 'white', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{countryInfo?.name}</div>
                        </div>
                        <div style={{ padding: 12 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 4 }}>{dest.name}</div>
                          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
                            {dest.poiCount > 0 ? `${dest.poiCount} lieux` : `${dest.days} jours suggérés`}
                          </div>
                          {preco && (
                            <div style={{ fontSize: 11, color: '#6366f1', backgroundColor: '#f5f3ff', padding: '4px 8px', borderRadius: 4, display: 'inline-block' }}>
                              {preco.nights} nuits
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
