import { useState, useEffect } from 'react';
import { Icon } from '../ui';
import { ItineraireBuilder } from './ItineraireBuilder';
import { DayPlanner } from './DayPlanner';
import { BudgetSummary } from './BudgetSummary';
import { COUNTRIES, DESTINATIONS } from '../../data/config';
import { DESTINATION_INFO } from '../../data/destinations';
import { getAllPOIForDestination } from '../../data/poi';
import { PRECONISATIONS } from '../../data/preconisations';

const getCountryForDestination = (destId, apiData) => {
  // D'abord chercher dans l'API
  if (apiData?.destinations) {
    const dest = apiData.destinations.find(d => d.id === destId);
    if (dest) return dest.country;
  }
  // Fallback sur les données locales
  for (const [countryId, destIds] of Object.entries(DESTINATIONS)) {
    if (destIds.includes(destId)) {
      return countryId;
    }
  }
  return null;
};

export function ConstruireView({ onAddFavorite, favorites = [], apiData }) {
  const [activeTab, setActiveTab] = useState('itineraire');
  const [itineraire, setItineraire] = useState(null);
  const [etapes, setEtapes] = useState([]);
  const [jours, setJours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrCreateItineraire();
  }, []);

  useEffect(() => {
    if (etapes.length > 0) {
      generateJours();
    } else {
      setJours([]);
    }
  }, [etapes]);

  const loadOrCreateItineraire = async () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem('tripflow-itineraire');
      if (saved) {
        const data = JSON.parse(saved);
        setItineraire(data.itineraire);
        setEtapes(data.etapes || []);
      } else {
        const newItineraire = {
          id: 'itineraire-' + Date.now(),
          nom: 'Mon Voyage Asie 2026',
          date_debut: '2026-04-01',
          date_fin: '2026-06-25',
          budget_total: 30000,
          created_at: new Date().toISOString()
        };
        setItineraire(newItineraire);
        setEtapes([]);
      }
    } catch (err) {
      setError('Erreur de chargement');
      console.error(err);
    }
    setLoading(false);
  };

  const saveItineraire = async () => {
    setSaving(true);
    try {
      const data = { itineraire, etapes, jours };
      localStorage.setItem('tripflow-itineraire', JSON.stringify(data));
    } catch (err) {
      setError('Erreur de sauvegarde');
      console.error(err);
    }
    setSaving(false);
  };

  useEffect(() => {
    if (itineraire && !loading) {
      const timer = setTimeout(() => {
        saveItineraire();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [itineraire, etapes]);

  const generateJours = () => {
    const newJours = [];
    let jourNumero = 1;
    const startDate = new Date(itineraire?.date_debut || '2026-04-01');

    etapes.forEach((etape, etapeIndex) => {
      const destInfo = DESTINATION_INFO[etape.destination_id];
      const apiDest = apiData?.destinations?.find(d => d.id === etape.destination_id);
      const countryId = getCountryForDestination(etape.destination_id, apiData);
      const destName = destInfo?.name || apiDest?.name || etape.destination_id;
      
      for (let i = 0; i < etape.nb_nuits; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + jourNumero - 1);
        
        newJours.push({
          id: `jour-${jourNumero}`,
          itineraire_id: itineraire?.id,
          etape_id: etape.id,
          etape: etape,
          destination_id: etape.destination_id,
          destination_name: destName,
          country_id: countryId,
          jour_numero: jourNumero,
          date: currentDate.toISOString().split('T')[0],
          jour_dans_etape: i + 1,
          is_premier_jour: i === 0,
          is_dernier_jour: i === etape.nb_nuits - 1,
          activites: { matin: [], apresmidi: [], soir: [] },
          repas: { petitdej: null, dejeuner: null, diner: null },
          notes: ''
        });
        jourNumero++;
      }
    });

    setJours(newJours);
  };

  const handleAddEtape = (destinationId) => {
    // Chercher d'abord dans les données locales
    const destInfo = DESTINATION_INFO[destinationId];
    // Puis dans l'API
    const apiDest = apiData?.destinations?.find(d => d.id === destinationId);
    const preco = PRECONISATIONS[destinationId];
    
    // Accepter si on a des infos locales OU des infos API
    if (!destInfo && !apiDest) {
      console.error('Destination non trouvée:', destinationId);
      return;
    }

    const newEtape = {
      id: 'etape-' + Date.now(),
      itineraire_id: itineraire?.id,
      destination_id: destinationId,
      destination_name: destInfo?.name || apiDest?.name || destinationId,
      ordre: etapes.length + 1,
      nb_nuits: preco?.nights || destInfo?.days || 3,
      hebergement_nom: '',
      hebergement_prix: preco?.accommodation?.midRange?.min || 50,
      transport_type: 'avion',
      transport_duree: '',
      transport_cout: 0
    };

    setEtapes([...etapes, newEtape]);
  };

  const handleUpdateEtape = (etapeId, updates) => {
    setEtapes(etapes.map(e => 
      e.id === etapeId ? { ...e, ...updates } : e
    ));
  };

  const handleRemoveEtape = (etapeId) => {
    setEtapes(etapes.filter(e => e.id !== etapeId));
  };

  const handleReorderEtapes = (newEtapes) => {
    setEtapes(newEtapes.map((e, i) => ({ ...e, ordre: i + 1 })));
  };

  const handleUpdateJour = (jourId, updates) => {
    setJours(jours.map(j =>
      j.id === jourId ? { ...j, ...updates } : j
    ));
  };

  const budgetStats = {
    hebergements: etapes.reduce((sum, e) => sum + ((e.hebergement_prix || 0) * e.nb_nuits), 0),
    transports: etapes.reduce((sum, e) => sum + (e.transport_cout || 0), 0),
    activites: jours.reduce((sum, j) => {
      const acts = j.activites || { matin: [], apresmidi: [], soir: [] };
      return sum + 
        (acts.matin?.reduce((s, a) => s + (a.cout || 0), 0) || 0) +
        (acts.apresmidi?.reduce((s, a) => s + (a.cout || 0), 0) || 0) +
        (acts.soir?.reduce((s, a) => s + (a.cout || 0), 0) || 0);
    }, 0),
    repas: jours.length * 40,
    divers: 2000,
    total: 0,
    budget: itineraire?.budget_total || 30000,
    reste: 0
  };
  budgetStats.total = budgetStats.hebergements + budgetStats.transports + budgetStats.activites + budgetStats.repas + budgetStats.divers;
  budgetStats.reste = budgetStats.budget - budgetStats.total;

  const totalNuits = etapes.reduce((sum, e) => sum + e.nb_nuits, 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      <div style={{ 
        padding: '20px 24px', 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}>
            Construire mon voyage
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0 0' }}>
            {etapes.length} destinations • {totalNuits} nuits • Budget: {budgetStats.total.toLocaleString()}€ / {budgetStats.budget.toLocaleString()}€
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {saving && (
            <span style={{ fontSize: 13, color: '#6b7280' }}>
              ⏳ Sauvegarde...
            </span>
          )}
          <button
            onClick={saveItineraire}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            💾 Sauvegarder
          </button>
        </div>
      </div>

      <div style={{ 
        padding: '0 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', gap: 0 }}>
          <button
            onClick={() => setActiveTab('itineraire')}
            style={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 500,
              color: activeTab === 'itineraire' ? '#6366f1' : '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'itineraire' ? '2px solid #6366f1' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🗺️ Mon Itinéraire
          </button>
          <button
            onClick={() => setActiveTab('planning')}
            style={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 500,
              color: activeTab === 'planning' ? '#6366f1' : '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'planning' ? '2px solid #6366f1' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            📅 Planning Jour par Jour
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            style={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 500,
              color: activeTab === 'budget' ? '#6366f1' : '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'budget' ? '2px solid #6366f1' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            💰 Budget Détaillé
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'itineraire' && (
          <ItineraireBuilder
            etapes={etapes}
            onAddEtape={handleAddEtape}
            onUpdateEtape={handleUpdateEtape}
            onRemoveEtape={handleRemoveEtape}
            onReorderEtapes={handleReorderEtapes}
            apiData={apiData}
          />
        )}
        {activeTab === 'planning' && (
          <DayPlanner
            jours={jours}
            etapes={etapes}
            onUpdateJour={handleUpdateJour}
            onAddFavorite={onAddFavorite}
            favorites={favorites}
            apiData={apiData}
          />
        )}
        {activeTab === 'budget' && (
          <BudgetSummary
            stats={budgetStats}
            etapes={etapes}
            jours={jours}
          />
        )}
      </div>
    </div>
  );
}
