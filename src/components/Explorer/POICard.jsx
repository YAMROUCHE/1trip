import { useState } from 'react';
import { Icon, Badge, Button } from '../ui';

export default function POICard({ poi, isInItinerary, onAdd, onRemove, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  const typeLabels = {
    activity: 'Activite',
    restaurant: 'Restaurant',
    hotel: 'Hotel',
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        transition: 'box-shadow 0.15s',
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '14px 16px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>{poi.name}</span>
            {poi.mustSee && <Icon name="star" size={14} className="" style={{ color: '#f59e0b' }} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Badge type={poi.type} size="sm">{typeLabels[poi.type]}</Badge>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{poi.category}</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{poi.price}</span>
            {poi.familyFriendly && (
              <span style={{ color: '#f59e0b' }}><Icon name="users" size={14} /></span>
            )}
          </div>
        </div>
        <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size={18} />
      </div>

      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '12px 0', lineHeight: 1.6 }}>
            {poi.description}
          </p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {poi.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  background: '#f1f5f9',
                  borderRadius: '4px',
                  color: '#64748b',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant={isInItinerary ? 'default' : 'primary'}
              size="sm"
              onClick={() => isInItinerary ? onRemove(poi.id) : onAdd(poi)}
              style={isInItinerary ? { background: '#dcfce7', color: '#16a34a' } : {}}
            >
              {isInItinerary ? (
                <><Icon name="check" size={14} /> Ajoute</>
              ) : (
                <><Icon name="plus" size={14} /> Ajouter</>
              )}
            </Button>
            {poi.lat && (
              <Button variant="ghost" size="sm" onClick={() => onSelect(poi)}>
                <Icon name="pin" size={14} /> Voir sur carte
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
