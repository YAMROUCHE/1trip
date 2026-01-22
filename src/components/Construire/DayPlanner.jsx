import { useState, useMemo } from 'react';
import { Icon } from '../ui';
import { DayCard } from './DayCard';
import { POISidebar } from './POISidebar';
import { DESTINATIONS, COUNTRIES } from '../../data/config';
import { getAllPOIForDestination } from '../../data/poi';

export function DayPlanner({ 
  jours, 
  etapes, 
  onUpdateJour,
  onAddFavorite,
  favorites, 
  apiData}) {
  const [selectedJourId, setSelectedJourId] = useState(jours[0]?.id || null);
  const [filterDestination, setFilterDestination] = useState('all');

  // Jour sélectionné
  const selectedJour = jours.find(j => j.id === selectedJourId);
  
  // POI disponibles pour la destination du jour sélectionné
  const availablePOIs = useMemo(() => {
    if (!selectedJour) return [];
    const destId = selectedJour.etape?.destination_id; return apiData?.poisByDestination?.[destId] || getAllPOIForDestination(destId);
  }, [selectedJour, apiData]);

  // Regrouper les jours par destination
  const joursByDestination = useMemo(() => {
    const grouped = {};
    jours.forEach(jour => {
      const destId = jour.etape?.destination_id;
      if (!grouped[destId]) {
        grouped[destId] = [];
      }
      grouped[destId].push(jour);
    });
    return grouped;
  }, [jours]);

  // Formatter la date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Ajouter une activité à un créneau
  const handleAddActivity = (creneau, poi) => {
    if (!selectedJour) return;
    
    const activites = { ...selectedJour.activites };
    if (!activites[creneau]) activites[creneau] = [];
    
    activites[creneau].push({
      id: 'act-' + Date.now(),
      poi_id: poi?.id || null,
      nom: poi?.name || 'Nouvelle activité',
      cout: poi?.priceValue || 0,
      type: poi?.type || 'activite'
    });

    onUpdateJour(selectedJour.id, { activites });
  };

  // Supprimer une activité
  const handleRemoveActivity = (creneau, activityId) => {
    if (!selectedJour) return;
    
    const activites = { ...selectedJour.activites };
    activites[creneau] = activites[creneau].filter(a => a.id !== activityId);
    
    onUpdateJour(selectedJour.id, { activites });
  };

  // Mettre à jour un repas
  const handleUpdateRepas = (type, data) => {
    if (!selectedJour) return;
    
    const repas = { ...selectedJour.repas };
    repas[type] = data;
    
    onUpdateJour(selectedJour.id, { repas });
  };

  // Mettre à jour les notes
  const handleUpdateNotes = (notes) => {
    if (!selectedJour) return;
    onUpdateJour(selectedJour.id, { notes });
  };

  if (jours.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        padding: 40
      }}>
        <div style={{ textAlign: 'center' }}>
          <Icon name="calendar" size={48} style={{ color: '#d1d5db', marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            Aucun jour planifié
          </h3>
          <p style={{ color: '#6b7280' }}>
            Ajoutez d'abord des destinations dans l'onglet "Mon Itinéraire"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 180px)' }}>
      {/* Liste des jours (gauche) */}
      <div style={{ 
        width: 280, 
        borderRight: '1px solid #e5e7eb',
        overflow: 'auto',
        backgroundColor: 'white'
      }}>
        <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
          <select
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontSize: 14
            }}
          >
            <option value="all">Toutes les destinations</option>
            {etapes.map(e => (
              <option key={e.destination_id} value={e.destination_id}>
                {DESTINATIONS[e.destination_id]?.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ padding: 8 }}>
          {Object.entries(joursByDestination)
            .filter(([destId]) => filterDestination === 'all' || destId === filterDestination)
            .map(([destId, destJours]) => {
              const dest = DESTINATIONS[destId];
              const country = COUNTRIES[dest?.country];

              return (
                <div key={destId} style={{ marginBottom: 16 }}>
                  {/* Header destination */}
                  <div style={{ 
                    padding: '8px 12px',
                    backgroundColor: country?.color || '#6366f1',
                    color: 'white',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 8
                  }}>
                    {country?.flag} {dest?.name}
                  </div>

                  {/* Liste des jours */}
                  {destJours.map(jour => {
                    const isSelected = jour.id === selectedJourId;
                    const hasActivities = 
                      (jour.activites?.matin?.length > 0) ||
                      (jour.activites?.apresmidi?.length > 0) ||
                      (jour.activites?.soir?.length > 0);

                    return (
                      <button
                        key={jour.id}
                        onClick={() => setSelectedJourId(jour.id)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          backgroundColor: isSelected ? '#f5f3ff' : 'transparent',
                          border: isSelected ? '1px solid #6366f1' : '1px solid transparent',
                          borderRadius: 8,
                          cursor: 'pointer',
                          textAlign: 'left',
                          marginBottom: 4,
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ 
                              fontWeight: 600, 
                              fontSize: 14,
                              color: isSelected ? '#6366f1' : '#111827'
                            }}>
                              Jour {jour.jour_numero}
                            </div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>
                              {formatDate(jour.date)}
                            </div>
                          </div>
                          {hasActivities && (
                            <div style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: '#10b981'
                            }} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>

      {/* Détail du jour (centre) */}
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        {selectedJour ? (
          <DayCard
            jour={selectedJour}
            onAddActivity={handleAddActivity}
            onRemoveActivity={handleRemoveActivity}
            onUpdateRepas={handleUpdateRepas}
            onUpdateNotes={handleUpdateNotes}
            formatDate={formatDate}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
            Sélectionnez un jour
          </div>
        )}
      </div>

      {/* Sidebar POI (droite) */}
      <POISidebar
        pois={availablePOIs}
        destinationId={selectedJour?.etape?.destination_id}
        onAddPOI={handleAddActivity}
        onAddFavorite={onAddFavorite}
        favorites={favorites}
      />
    </div>
  );
}
