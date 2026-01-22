import { useState } from 'react';
import { Icon } from '../ui';
import { DESTINATIONS, COUNTRIES } from '../../data/config';

const CRENEAUX = [
  { id: 'matin', label: 'Matin', icon: 'sunrise', color: '#f59e0b' },
  { id: 'apresmidi', label: 'Après-midi', icon: 'sun', color: '#f97316' },
  { id: 'soir', label: 'Soirée', icon: 'moon', color: '#8b5cf6' }
];

const REPAS_TYPES = [
  { id: 'petitdej', label: 'Petit-déjeuner', icon: 'coffee', defaultCout: 5 },
  { id: 'dejeuner', label: 'Déjeuner', icon: 'utensils', defaultCout: 15 },
  { id: 'diner', label: 'Dîner', icon: 'utensils', defaultCout: 20 }
];

export function DayCard({
  jour,
  onAddActivity,
  onRemoveActivity,
  onUpdateRepas,
  onUpdateNotes,
  formatDate
}) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(jour.notes || '');
  const [dragOverCreneau, setDragOverCreneau] = useState(null);

  const dest = DESTINATIONS[jour.etape?.destination_id];
  const country = COUNTRIES[dest?.country];

  // Calculer le budget du jour
  const calculateDayBudget = () => {
    let total = 0;
    
    // Activités
    CRENEAUX.forEach(c => {
      const acts = jour.activites?.[c.id] || [];
      acts.forEach(a => { total += a.cout || 0; });
    });
    
    // Repas
    REPAS_TYPES.forEach(r => {
      const repas = jour.repas?.[r.id];
      total += repas?.cout || r.defaultCout;
    });

    return total;
  };

  const handleSaveNotes = () => {
    onUpdateNotes(notesValue);
    setEditingNotes(false);
  };

  return (
    <div>
      {/* Header du jour */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 24
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: country?.color || '#6366f1',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 18
            }}>
              {jour.jour_numero}
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}>
                {formatDate(jour.date)} - {dest?.name}
              </h2>
              <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0 0' }}>
                {jour.is_premier_jour && '🚗 Jour d\'arrivée • '}
                {jour.is_dernier_jour && '👋 Dernier jour • '}
                Jour {jour.jour_dans_etape} sur {jour.etape?.nb_nuits}
              </p>
            </div>
          </div>
        </div>
        <div style={{
          padding: '10px 16px',
          backgroundColor: '#f0fdf4',
          borderRadius: 10,
          border: '1px solid #bbf7d0'
        }}>
          <span style={{ fontSize: 13, color: '#166534' }}>Budget jour</span>
          <span style={{ 
            display: 'block', 
            fontSize: 20, 
            fontWeight: 700, 
            color: '#15803d' 
          }}>
            {calculateDayBudget()}€
          </span>
        </div>
      </div>

      {/* Créneaux activités */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {CRENEAUX.map(creneau => {
          const activities = jour.activites?.[creneau.id] || [];
          const isDragOver = dragOverCreneau === creneau.id;

          return (
            <div 
              key={creneau.id}
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                border: isDragOver ? '2px solid #6366f1' : '1px solid #e5e7eb',
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Header créneau */}
              <div style={{
                padding: '12px 16px',
                backgroundColor: isDragOver ? '#eef2ff' : '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background-color 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: creneau.color + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon name={creneau.icon} size={16} style={{ color: creneau.color }} />
                  </div>
                  <span style={{ fontWeight: 600, color: '#374151' }}>
                    {creneau.label}
                  </span>
                  {isDragOver && (
                    <span style={{ 
                      fontSize: 12, 
                      color: '#6366f1', 
                      fontWeight: 500,
                      backgroundColor: '#e0e7ff',
                      padding: '2px 8px',
                      borderRadius: 4
                    }}>
                      Déposez ici !
                    </span>
                  )}
                </div>
                {activities.length > 0 && (
                  <span style={{ fontSize: 13, color: '#6b7280' }}>
                    {activities.reduce((sum, a) => sum + (a.cout || 0), 0)}€
                  </span>
                )}
              </div>

              {/* Liste activités */}
              <div 
                style={{ 
                  padding: 12,
                  backgroundColor: isDragOver ? '#f5f3ff' : 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverCreneau(creneau.id);
                }}
                onDragLeave={(e) => {
                  // Vérifier si on quitte vraiment la zone
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setDragOverCreneau(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverCreneau(null);
                  try {
                    const poi = JSON.parse(e.dataTransfer.getData('application/json'));
                    onAddActivity(creneau.id, poi);
                  } catch (err) {
                    console.error('Drop error:', err);
                  }
                }}
              >
                {activities.length === 0 ? (
                  <div style={{ 
                    padding: 16, 
                    textAlign: 'center',
                    color: isDragOver ? '#4f46e5' : '#9ca3af',
                    fontSize: 14,
                    border: isDragOver ? '2px dashed #6366f1' : '2px dashed #e5e7eb',
                    borderRadius: 8,
                    backgroundColor: isDragOver ? '#eef2ff' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}>
                    {isDragOver ? '📍 Relâchez pour ajouter cette activité' : 'Glissez une activité depuis la liste à droite'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {activities.map(activity => (
                      <div 
                        key={activity.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          backgroundColor: '#f9fafb',
                          borderRadius: 8
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 14, color: '#111827' }}>
                            {activity.nom}
                          </span>
                          {activity.cout > 0 && (
                            <span style={{ 
                              fontSize: 12, 
                              color: '#6366f1',
                              backgroundColor: '#f5f3ff',
                              padding: '2px 8px',
                              borderRadius: 4
                            }}>
                              {activity.cout}€
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveActivity(creneau.id, activity.id)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: 'none',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Icon name="x" size={14} />
                        </button>
                      </div>
                    ))}
                    {/* Zone de drop supplémentaire quand il y a déjà des activités */}
                    {isDragOver && (
                      <div style={{ 
                        padding: 12, 
                        textAlign: 'center',
                        color: '#4f46e5',
                        fontSize: 13,
                        border: '2px dashed #6366f1',
                        borderRadius: 8,
                        backgroundColor: '#eef2ff'
                      }}>
                        📍 Relâchez pour ajouter
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Repas */}
      <div style={{
        marginTop: 24,
        backgroundColor: 'white',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: '#fef3c720',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🍽️
          </div>
          <span style={{ fontWeight: 600, color: '#374151' }}>Restauration</span>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {REPAS_TYPES.map(repas => {
              const repasData = jour.repas?.[repas.id] || { description: '', cout: repas.defaultCout };

              return (
                <div key={repas.id} style={{ 
                  padding: 12,
                  backgroundColor: '#f9fafb',
                  borderRadius: 8
                }}>
                  <div style={{ 
                    fontSize: 12, 
                    fontWeight: 500, 
                    color: '#6b7280',
                    marginBottom: 8
                  }}>
                    {repas.label}
                  </div>
                  <input
                    type="text"
                    value={repasData.description || ''}
                    onChange={(e) => onUpdateRepas(repas.id, { 
                      ...repasData, 
                      description: e.target.value 
                    })}
                    placeholder="Restaurant ou description"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 6,
                      border: '1px solid #d1d5db',
                      fontSize: 13,
                      marginBottom: 8
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="number"
                      value={repasData.cout || repas.defaultCout}
                      onChange={(e) => onUpdateRepas(repas.id, { 
                        ...repasData, 
                        cout: parseInt(e.target.value) || 0 
                      })}
                      style={{
                        width: 60,
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid #d1d5db',
                        fontSize: 13
                      }}
                    />
                    <span style={{ fontSize: 13, color: '#6b7280' }}>€</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div style={{
        marginTop: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        padding: 16
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 12
        }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>
            📝 Notes du jour
          </span>
          {!editingNotes && (
            <button
              onClick={() => setEditingNotes(true)}
              style={{
                padding: '4px 10px',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                color: '#6b7280',
                cursor: 'pointer'
              }}
            >
              Modifier
            </button>
          )}
        </div>

        {editingNotes ? (
          <div>
            <textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              placeholder="Ajoutez vos notes, rappels, informations importantes..."
              style={{
                width: '100%',
                minHeight: 100,
                padding: 12,
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 14,
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={handleSaveNotes}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Enregistrer
              </button>
              <button
                onClick={() => {
                  setNotesValue(jour.notes || '');
                  setEditingNotes(false);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <p style={{ 
            fontSize: 14, 
            color: jour.notes ? '#374151' : '#9ca3af',
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}>
            {jour.notes || 'Aucune note pour ce jour'}
          </p>
        )}
      </div>
    </div>
  );
}
