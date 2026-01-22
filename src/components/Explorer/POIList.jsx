import POICard from './POICard';

export default function POIList({ pois, itinerary, onAdd, onRemove, onSelect }) {
  const isInItinerary = (id) => itinerary.some((p) => p.id === id);

  if (pois.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
        <p>Aucun resultat</p>
        <p style={{ fontSize: '13px', marginTop: '4px' }}>Essayez d autres filtres</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {pois.map((poi) => (
        <POICard
          key={poi.id}
          poi={poi}
          isInItinerary={isInItinerary(poi.id)}
          onAdd={onAdd}
          onRemove={onRemove}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
