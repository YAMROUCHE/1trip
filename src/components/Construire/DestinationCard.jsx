import { useState } from 'react';
import { Icon } from '../ui';
import { COUNTRIES, DESTINATIONS } from '../../data/config';
import { DESTINATION_INFO } from '../../data/destinations';
import { PRECONISATIONS } from '../../data/preconisations';

const getCountryInfo = (countryId) => {
  return COUNTRIES.find(c => c.id === countryId);
};

const COUNTRY_COLORS = {
  philippines: '#3b82f6',
  thailande: '#ef4444',
  vietnam: '#eab308',
  bali: '#22c55e'
};

export function DestinationCard({
  etape,
  index,
  onUpdate,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  transportTypes
}) {
  const [expanded, setExpanded] = useState(false);
  
  // Utiliser les données locales OU les données de l'étape (venant de l'API)
  const destInfo = DESTINATION_INFO[etape.destination_id];
  const destName = destInfo?.name || etape.destination_name || etape.destination_id;
  const destImage = destInfo?.image || `https://source.unsplash.com/800x600/?${encodeURIComponent(destName)},travel`;
  
  // Trouver le pays - d'abord dans les données locales, sinon depuis l'étape
  let countryId = null;
  for (const [cId, destIds] of Object.entries(DESTINATIONS)) {
    if (destIds.includes(etape.destination_id)) {
      countryId = cId;
      break;
    }
  }
  // Si pas trouvé localement, utiliser les données de l'étape
  if (!countryId && etape.destination_id) {
    // Déduire du nom de destination connu
    const destIdLower = etape.destination_id.toLowerCase();
    if (['amed', 'canggu', 'denpasar', 'jimbaran', 'kuta', 'lovina', 'munduk', 'nusa-lembongan', 'nusa-penida', 'sanur', 'seminyak', 'sidemen', 'tegallalang', 'tulamben', 'ubud', 'uluwatu'].includes(destIdLower)) {
      countryId = 'bali';
    } else if (['bangkok', 'chiang-mai', 'chiang-rai', 'hua-hin', 'kanchanaburi', 'koh-lanta', 'krabi', 'pai', 'phuket', 'sukhothai'].includes(destIdLower)) {
      countryId = 'thailande';
    } else if (['hanoi', 'hoi-an', 'ninh-binh'].includes(destIdLower)) {
      countryId = 'vietnam';
    } else if (['bohol', 'boracay', 'cebu', 'coron', 'el-nido', 'manila', 'moalboal', 'palawan', 'port-barton', 'puerto-princesa', 'siargao'].includes(destIdLower)) {
      countryId = 'philippines';
    }
  }
  
  const countryInfo = getCountryInfo(countryId);
  const preco = PRECONISATIONS[etape.destination_id];

  const handleNightsChange = (delta) => {
    const newNights = Math.max(1, etape.nb_nuits + delta);
    onUpdate({ nb_nuits: newNights });
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        border: isDragging ? '2px solid #6366f1' : '1px solid #e5e7eb',
        overflow: 'hidden',
        opacity: isDragging ? 0.8 : 1,
        cursor: 'grab',
        transition: 'all 0.2s'
      }}
    >
      {/* Header de la carte */}
      <div style={{ 
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        {/* Handle drag */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          padding: '4px 0',
          cursor: 'grab',
          color: '#9ca3af'
        }}>
          ⋮⋮
        </div>

        {/* Numéro */}
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: COUNTRY_COLORS[countryId] || '#6366f1',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 14,
          flexShrink: 0
        }}>
          {index + 1}
        </div>

        {/* Image miniature */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          backgroundImage: `url(${destImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0,
          backgroundColor: '#e5e7eb'
        }} />

        {/* Info destination */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 16, color: '#111827' }}>
              {destName}
            </span>
            {countryInfo && (
              <span style={{ 
                fontSize: 12, 
                color: 'white',
                backgroundColor: COUNTRY_COLORS[countryId] || '#6b7280',
                padding: '2px 8px',
                borderRadius: 10
              }}>
                {countryInfo.name}
              </span>
            )}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
            {etape.hebergement_nom ? etape.hebergement_nom : 'Hébergement à définir'}
          </div>
        </div>

        {/* Nuits */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          backgroundColor: '#f3f4f6',
          borderRadius: 8,
          padding: '4px 8px'
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); handleNightsChange(-1); }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: 'none',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: '#6b7280'
            }}
          >
            −
          </button>
          <span style={{ 
            fontWeight: 600, 
            fontSize: 15,
            minWidth: 60,
            textAlign: 'center'
          }}>
            {etape.nb_nuits} nuits
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); handleNightsChange(1); }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: 'none',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: '#6b7280'
            }}
          >
            +
          </button>
        </div>

        {/* Actions */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: 'none',
            backgroundColor: expanded ? '#6366f1' : '#f3f4f6',
            color: expanded ? 'white' : '#374151',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12
          }}
        >
          {expanded ? '▲' : '▼'}
        </button>

        <button
          onClick={onRemove}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: 'none',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16
          }}
        >
          ✕
        </button>
      </div>

      {/* Détails expandables */}
      {expanded && (
        <div style={{ 
          padding: '16px 20px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          {/* Préconisation */}
          {preco && (
            <div style={{
              backgroundColor: '#f5f3ff',
              border: '1px solid #e0e7ff',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 18 }}>💡</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#4338ca', marginBottom: 4 }}>
                    Préconisation
                  </div>
                  <div style={{ fontSize: 13, color: '#6366f1' }}>
                    {preco.nights} nuits recommandées • Budget moyen: {preco.avgBudgetPerDay}€/jour
                  </div>
                  {preco.tips && (
                    <div style={{ fontSize: 13, color: '#4b5563', marginTop: 6 }}>
                      {preco.tips}
                    </div>
                  )}
                  {preco.familyTips && (
                    <div style={{ fontSize: 13, color: '#059669', marginTop: 6 }}>
                      👨‍👩‍👦 {preco.familyTips}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Hébergement */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: 13, 
                fontWeight: 500, 
                color: '#374151',
                marginBottom: 6
              }}>
                🏨 Hébergement
              </label>
              <input
                type="text"
                value={etape.hebergement_nom || ''}
                onChange={(e) => onUpdate({ hebergement_nom: e.target.value })}
                placeholder="Nom de l'hôtel"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  fontSize: 14,
                  marginBottom: 8,
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="number"
                  value={etape.hebergement_prix || 0}
                  onChange={(e) => onUpdate({ hebergement_prix: parseInt(e.target.value) || 0 })}
                  style={{
                    width: 80,
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: 14
                  }}
                />
                <span style={{ color: '#6b7280', fontSize: 13 }}>€/nuit</span>
                <span style={{ 
                  marginLeft: 'auto', 
                  fontWeight: 600, 
                  color: '#6366f1',
                  fontSize: 14
                }}>
                  = {((etape.hebergement_prix || 0) * etape.nb_nuits).toLocaleString()}€
                </span>
              </div>
            </div>

            {/* Transport */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: 13, 
                fontWeight: 500, 
                color: '#374151',
                marginBottom: 6
              }}>
                🚗 Transport vers {destName}
              </label>
              <select
                value={etape.transport_type || 'avion'}
                onChange={(e) => onUpdate({ transport_type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  fontSize: 14,
                  marginBottom: 8,
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              >
                {transportTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="text"
                  value={etape.transport_duree || ''}
                  onChange={(e) => onUpdate({ transport_duree: e.target.value })}
                  placeholder="Durée"
                  style={{
                    width: 80,
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: 14
                  }}
                />
                <input
                  type="number"
                  value={etape.transport_cout || 0}
                  onChange={(e) => onUpdate({ transport_cout: parseInt(e.target.value) || 0 })}
                  placeholder="Coût"
                  style={{
                    width: 80,
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: 14
                  }}
                />
                <span style={{ color: '#6b7280', fontSize: 13 }}>€</span>
              </div>
            </div>
          </div>

          {/* Résumé coût étape */}
          <div style={{
            marginTop: 16,
            padding: '12px 16px',
            backgroundColor: 'white',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#6b7280', fontSize: 14 }}>
              Coût total {destName}
            </span>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>
              {(((etape.hebergement_prix || 0) * etape.nb_nuits) + (etape.transport_cout || 0)).toLocaleString()}€
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
