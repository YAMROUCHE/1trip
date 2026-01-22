import { useState, useMemo } from 'react';
import { useAPIData } from './hooks/useAPI';
import { Icon } from './components/ui';
import { MapView } from './components/Map';
import { COUNTRIES, DESTINATIONS } from './data/config';
import { DESTINATION_INFO } from './data/destinations';
import { POI_DATA, CATEGORIES, getAllPOIForDestination, getAllPOICount } from './data/poi';
import './styles/global.css';
import { ConstruireView } from './components/Construire';
import { AccueilView } from './components/AccueilView';
import { StipplSidebar } from './components/StipplSidebar';
import { BudgetView } from './components/BudgetView';
import { PackingView } from './components/PackingView';
import { DocumentsView } from './components/DocumentsView';
import { SummaryView } from './components/SummaryView';

const TRIP_CONFIG = {
  name: 'Asie du Sud-Est 2026',
  startDate: '1 avril',
  endDate: '25 juin',
  totalDays: 86,
  budget: 30000,
};

const TRIP_DESTINATIONS = [
  { id: 'el-nido', country: 'philippines', nights: 6, startDay: 1, transport: { type: 'avion', duration: '24h', cost: 850 }, sleeping: 'One El Nido Suite', costPerNight: 85 },
  { id: 'port-barton', country: 'philippines', nights: 3, startDay: 7, transport: { type: 'van', duration: '3h', cost: 25 }, sleeping: 'Gilian Beach Front', costPerNight: 40 },
  { id: 'bohol', country: 'philippines', nights: 5, startDay: 10, transport: { type: 'avion', duration: '4h', cost: 80 }, sleeping: 'Alona Beach Resort', costPerNight: 70 },
  { id: 'moalboal', country: 'philippines', nights: 6, startDay: 15, transport: { type: 'ferry', duration: '2h', cost: 15 }, sleeping: 'Panagsama Stay', costPerNight: 55 },
  { id: 'bangkok', country: 'thailande', nights: 5, startDay: 21, transport: { type: 'avion', duration: '3h', cost: 120 }, sleeping: 'Ibis Sukhumvit', costPerNight: 60 },
  { id: 'chiang-mai', country: 'thailande', nights: 7, startDay: 26, transport: { type: 'avion', duration: '1h', cost: 45 }, sleeping: 'Rachamankha', costPerNight: 90 },
  { id: 'koh-lanta', country: 'thailande', nights: 8, startDay: 33, transport: { type: 'avion+ferry', duration: '4h', cost: 85 }, sleeping: 'Lanta Casa Blanca', costPerNight: 75 },
  { id: 'hoi-an', country: 'vietnam', nights: 5, startDay: 41, transport: { type: 'avion', duration: '2h', cost: 95 }, sleeping: 'Vinh Hung Heritage', costPerNight: 50 },
  { id: 'ninh-binh', country: 'vietnam', nights: 3, startDay: 46, transport: { type: 'train', duration: '6h', cost: 35 }, sleeping: 'Tam Coc Garden', costPerNight: 65 },
  { id: 'hanoi', country: 'vietnam', nights: 4, startDay: 49, transport: { type: 'bus', duration: '2h', cost: 10 }, sleeping: 'Essence Hanoi', costPerNight: 55 },
  { id: 'ubud', country: 'bali', nights: 10, startDay: 53, transport: { type: 'avion', duration: '4h', cost: 150 }, sleeping: 'Alam Jiwa', costPerNight: 80 },
  { id: 'sanur', country: 'bali', nights: 6, startDay: 63, transport: { type: 'voiture', duration: '1h', cost: 15 }, sleeping: 'Segara Village', costPerNight: 70 },
  { id: 'nusa-penida', country: 'bali', nights: 4, startDay: 69, transport: { type: 'bateau', duration: '45min', cost: 20 }, sleeping: 'La Rip Bungalows', costPerNight: 60 },
  { id: 'canggu', country: 'bali', nights: 14, startDay: 73, transport: { type: 'bateau+voiture', duration: '2h', cost: 25 }, sleeping: 'Theanna Eco Villa', costPerNight: 85 },
];

const styles = {
  sidebar: { width: '80px', background: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '16px', gap: '4px' },
  sidebarBtn: (active) => ({ width: '60px', height: '56px', borderRadius: '8px', border: 'none', background: active ? '#eef2ff' : 'transparent', color: active ? '#6366f1' : '#6b7280', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', fontSize: '9px', fontWeight: 500, transition: 'all 0.15s' }),
  header: { padding: '16px 24px', borderBottom: '1px solid #e5e7eb', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  stats: { display: 'flex', gap: '32px' },
  stat: { textAlign: 'right' },
  statValue: { fontSize: '20px', fontWeight: 700, color: '#111827' },
  statLabel: { fontSize: '12px', color: '#6b7280', marginTop: '2px' },
  tabs: { display: 'flex', gap: '0', padding: '0 24px', borderBottom: '1px solid #e5e7eb', background: '#ffffff' },
  tab: (active) => ({ padding: '12px 20px', fontSize: '13px', fontWeight: 500, background: 'none', border: 'none', color: active ? '#6366f1' : '#6b7280', borderBottom: active ? '2px solid #6366f1' : '2px solid transparent', cursor: 'pointer', marginBottom: '-1px' }),
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '16px', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' },
  destNum: { width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: 'white' },
  nightsControl: { display: 'flex', alignItems: 'center', gap: '12px' },
  nightsBtn: { width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '16px' },
  nightsValue: { fontSize: '15px', fontWeight: 600, color: '#111827', minWidth: '24px', textAlign: 'center' },
  badge: (bg, color) => ({ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: bg, borderRadius: '6px', fontSize: '12px', color: color, fontWeight: 500 }),
};

const getCountryColor = (country) => {
  const colors = { philippines: '#3b82f6', thailande: '#ef4444', vietnam: '#f59e0b', bali: '#22c55e' };
  return colors[country] || '#6b7280';
};

export default function App() {
  const [sidebarTab, setSidebarTab] = useState('accueil');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('destinations');
  const [destinations, setDestinations] = useState(TRIP_DESTINATIONS);
  const [favorites, setFavorites] = useState([]);
  const [explorerCountry, setExplorerCountry] = useState('philippines');
  const [explorerDest, setExplorerDest] = useState('el-nido');
  const [guideCountry, setGuideCountry] = useState('philippines');
  const [guideDest, setGuideDest] = useState('el-nido');
  const [guideCategory, setGuideCategory] = useState('all');
  const [myProgram, setMyProgram] = useState([]);

  // Chargement des données depuis l'API (avec fallback sur données locales)
  const { data: apiData, loading: apiLoading, error: apiError } = useAPIData();

  const totalNights = destinations.reduce((sum, d) => sum + d.nights, 0);
  const totalAccommodation = destinations.reduce((sum, d) => sum + (d.nights * d.costPerNight), 0);
  const totalTransport = destinations.reduce((sum, d) => sum + (d.transport?.cost || 0), 0);
  const totalCost = totalAccommodation + totalTransport;
  const totalPOI = apiData?.stats?.totalPOIs || getAllPOICount();

  const updateNights = (id, delta) => {
    setDestinations(prev => prev.map(d => d.id === id ? { ...d, nights: Math.max(1, d.nights + delta) } : d));
  };

  const toggleFavorite = (poi) => {
    setFavorites(prev => prev.some(f => f.id === poi.id) ? prev.filter(f => f.id !== poi.id) : [...prev, poi]);
  };

  const isFavorite = (id) => favorites.some(f => f.id === id);

  const addToProgram = (poi) => {
    if (!myProgram.find(p => p.id === poi.id)) {
      setMyProgram([...myProgram, poi]);
    }
  };

  const removeFromProgram = (poiId) => {
    setMyProgram(myProgram.filter(p => p.id !== poiId));
  };

  const isInProgram = (poiId) => myProgram.some(p => p.id === poiId);

  const explorerPois = useMemo(() => { if (apiData?.poisByDestination?.[explorerDest]) { return apiData.poisByDestination[explorerDest]; } return POI_DATA[explorerCountry]?.[explorerDest] || []; }, [apiData, explorerCountry, explorerDest]);
  const guidePois = useMemo(() => {
    if (guideCategory === 'all') {
      return getAllPOIForDestination(guideCountry, guideDest);
    }
    const pois = POI_DATA[guideCountry]?.[guideDest]?.[guideCategory] || [];
    const cat = CATEGORIES.find(c => c.id === guideCategory);
    return pois.map(poi => ({ ...poi, categoryId: guideCategory, categoryLabel: cat?.label, categoryColor: cat?.color }));
  }, [guideCountry, guideDest, guideCategory]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <StipplSidebar
        activeTab={sidebarTab}
        onTabChange={setSidebarTab}
        userName="Youssef"
      />

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="plane" size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>{TRIP_CONFIG.name}</h1>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{TRIP_CONFIG.startDate} - {TRIP_CONFIG.endDate}</p>
            </div>
          </div>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statValue}>€{totalCost.toLocaleString()}</div>
              <div style={styles.statLabel}>Coût estimé</div>
            </div>
            <div style={styles.stat}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ ...styles.statValue, color: '#6366f1' }}>{totalNights}</span>
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>/{TRIP_CONFIG.totalDays}</span>
              </div>
              <div style={styles.statLabel}>Nuits</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statValue}>{destinations.length}</div>
              <div style={styles.statLabel}>Destinations</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statValue}>{favorites.length}</div>
              <div style={styles.statLabel}>Favoris</div>
            </div>
          </div>
        </header>


      {/* VUE ACCUEIL */}
      {sidebarTab === 'accueil' && (
        <AccueilView 
          totalNights={totalNights}
          totalCost={totalCost}
          budget={TRIP_CONFIG.budget}
          destinations={destinations}
          totalPOI={totalPOI}
          favorites={favorites}
          onNavigate={setSidebarTab}
        />
      )}

      {/* VUE SUMMARY */}
      {sidebarTab === 'summary' && (
        <SummaryView
          tripName="Asie du Sud-Est 2026"
          totalNights={totalNights}
          totalCost={totalCost}
          budget={TRIP_CONFIG.budget}
          destinations={destinations}
          totalPOI={totalPOI}
          favorites={favorites}
          onNavigate={setSidebarTab}
        />
      )}
        {/* VUE PLAN */}
        {sidebarTab === 'monvoyage' && (
          <>
            <div style={styles.tabs}>
              <button onClick={() => setActiveTab('destinations')} style={styles.tab(activeTab === 'destinations')}>Destinations</button>
              <button onClick={() => setActiveTab('daybyday')} style={styles.tab(activeTab === 'daybyday')}>Day by day</button>
            </div>
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <div style={{ flex: 1, overflow: 'auto' }}>
                {activeTab === 'destinations' ? (
                  <table style={styles.table}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ ...styles.th, width: '250px' }}><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="pin" size={14} />DESTINATION</span></th>
                        <th style={{ ...styles.th, width: '120px', textAlign: 'center' }}><span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}><Icon name="calendar" size={14} />NUITS</span></th>
                        <th style={{ ...styles.th, width: '200px' }}><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="bed" size={14} />HÉBERGEMENT</span></th>
                        <th style={{ ...styles.th, width: '120px' }}><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="search" size={14} />EXPLORER</span></th>
                        <th style={{ ...styles.th, width: '140px' }}><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="plane" size={14} />TRANSPORT</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinations.map((dest, index) => {
                        const info = DESTINATION_INFO[dest.id];
                        const pois = POI_DATA[dest.country]?.[dest.id];
                        const poiCount = pois ? (Array.isArray(pois) ? pois.length : Object.values(pois).flat().length) : 0;
                        return (
                          <tr key={dest.id} style={{ background: 'white' }}>
                            <td style={styles.td}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ ...styles.destNum, background: getCountryColor(dest.country) }}>{index + 1}</div>
                                <div>
                                  <div style={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>{info?.name}</div>
                                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Jour {dest.startDay} - {dest.startDay + dest.nights - 1}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ ...styles.td, textAlign: 'center' }}>
                              <div style={styles.nightsControl}>
                                <button onClick={() => updateNights(dest.id, -1)} style={styles.nightsBtn}>−</button>
                                <span style={styles.nightsValue}>{dest.nights}</span>
                                <button onClick={() => updateNights(dest.id, 1)} style={styles.nightsBtn}>+</button>
                              </div>
                            </td>
                            <td style={styles.td}><span style={styles.badge('#f0fdf4', '#166534')}><Icon name="check" size={14} />{dest.sleeping}</span></td>
                            <td style={styles.td}>
                              <button onClick={() => { setExplorerCountry(dest.country); setExplorerDest(dest.id); setSidebarTab('explore'); }} style={{ ...styles.badge('#eef2ff', '#4f46e5'), border: 'none', cursor: 'pointer' }}>
                                <Icon name="plus" size={14} />{poiCount} lieux
                              </button>
                            </td>
                            <td style={styles.td}>{dest.transport && <span style={styles.badge('#fef3c7', '#b45309')}><Icon name="plane" size={12} />{dest.transport.duration}</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: '24px' }}>
                    {destinations.map((dest, index) => {
                      const info = DESTINATION_INFO[dest.id];
                      const pois = POI_DATA[dest.country]?.[dest.id];
                      const poiList = pois ? (Array.isArray(pois) ? pois : Object.values(pois).flat()) : [];
                      return (
                        <div key={dest.id} style={{ marginBottom: '24px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
                            <img src={info?.image} alt={info?.name} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ ...styles.destNum, width: '28px', height: '28px', fontSize: '12px', background: getCountryColor(dest.country) }}>{index + 1}</div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>{info?.name}</h3>
                              </div>
                              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>{dest.nights} nuits · Jour {dest.startDay} au {dest.startDay + dest.nights - 1}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>€{dest.nights * dest.costPerNight}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>{dest.sleeping}</div>
                            </div>
                          </div>
                          <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
                            {poiList.slice(0, 6).map(poi => (
                              <div key={poi.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: poi.type === 'restaurant' ? '#fff7ed' : '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Icon name={poi.type === 'restaurant' ? 'utensils' : poi.type === 'hotel' ? 'bed' : 'pin'} size={16} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{poi.name}</div>
                                  <div style={{ fontSize: '11px', color: '#6b7280' }}>{poi.category}</div>
                                </div>
                                <button onClick={() => toggleFavorite(poi)} style={{ background: isFavorite(poi.id) ? '#fef3c7' : '#f1f5f9', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: isFavorite(poi.id) ? '#f59e0b' : '#9ca3af' }}>
                                  <Icon name="star" size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div style={{ width: '40%', borderLeft: '1px solid #e5e7eb' }}>
                <MapView destination={destinations[0]?.id} pois={[]} selectedPOI={null} onSelectPOI={() => {}} />
              </div>
            </div>
          </>
        )}

        {/* VUE BUDGET */}
        {sidebarTab === 'budget' && (
          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Budget total</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>€{TRIP_CONFIG.budget.toLocaleString()}</div>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Dépenses planifiées</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#6366f1' }}>€{totalCost.toLocaleString()}</div>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Reste disponible</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#22c55e' }}>€{(TRIP_CONFIG.budget - totalCost).toLocaleString()}</div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#111827' }}>Détail par catégorie</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ ...styles.th }}>Catégorie</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Montant</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>% du budget</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={styles.td}>Hébergements</td><td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>€{totalAccommodation.toLocaleString()}</td><td style={{ ...styles.td, textAlign: 'right', color: '#6b7280' }}>{Math.round(totalAccommodation/TRIP_CONFIG.budget*100)}%</td></tr>
                  <tr><td style={styles.td}>Transports</td><td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>€{totalTransport.toLocaleString()}</td><td style={{ ...styles.td, textAlign: 'right', color: '#6b7280' }}>{Math.round(totalTransport/TRIP_CONFIG.budget*100)}%</td></tr>
                  <tr><td style={styles.td}>Activités (estimé)</td><td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>€2,500</td><td style={{ ...styles.td, textAlign: 'right', color: '#6b7280' }}>8%</td></tr>
                  <tr><td style={styles.td}>Repas (estimé)</td><td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>€4,300</td><td style={{ ...styles.td, textAlign: 'right', color: '#6b7280' }}>14%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VUE FAVORIS */}
        {sidebarTab === 'favoris' && (
          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Mes favoris ({favorites.length})</h2>
            {favorites.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '60px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '56px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon name="star" size={24} />
                </div>
                <p style={{ color: '#6b7280', marginBottom: '8px' }}>Aucun favori pour le moment</p>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>Explorez les destinations et ajoutez des lieux à vos favoris</p>
                <button onClick={() => setSidebarTab('explore')} style={{ marginTop: '16px', padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
                  Explorer les lieux
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {favorites.map(poi => (
                  <div key={poi.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: poi.type === 'restaurant' ? '#fff7ed' : poi.type === 'hotel' ? '#f0fdf4' : '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon name={poi.type === 'restaurant' ? 'utensils' : poi.type === 'hotel' ? 'bed' : 'pin'} size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827', marginBottom: '4px' }}>{poi.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{poi.category} · {poi.price}</div>
                        <p style={{ fontSize: '13px', color: '#4b5563', margin: 0, lineHeight: 1.5 }}>{poi.description}</p>
                      </div>
                      <button onClick={() => toggleFavorite(poi)} style={{ background: '#fef3c7', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer', color: '#f59e0b' }}>
                        <Icon name="star" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VUE EXPLORER */}
        {sidebarTab === 'explorer' && (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: '55%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {COUNTRIES.map(c => (
                    <button key={c.id} onClick={() => { setExplorerCountry(c.id); setExplorerDest(DESTINATIONS[c.id][0]); }}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, background: explorerCountry === c.id ? getCountryColor(c.id) : '#f1f5f9', color: explorerCountry === c.id ? 'white' : '#6b7280' }}>
                      {c.name}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {DESTINATIONS[explorerCountry]?.map(d => {
                    const info = DESTINATION_INFO[d];
                    return (
                      <button key={d} onClick={() => setExplorerDest(d)}
                        style={{ padding: '6px 14px', borderRadius: '20px', border: explorerDest === d ? '2px solid #6366f1' : '1px solid #e5e7eb', cursor: 'pointer', fontSize: '13px', background: 'white', color: explorerDest === d ? '#6366f1' : '#374151', fontWeight: explorerDest === d ? 600 : 400 }}>
                        {info?.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(Array.isArray(explorerPois) ? explorerPois : Object.values(explorerPois).flat()).map(poi => (
                    <div key={poi.id} style={{ background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: poi.type === 'restaurant' ? '#fff7ed' : poi.type === 'hotel' ? '#f0fdf4' : '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon name={poi.type === 'restaurant' ? 'utensils' : poi.type === 'hotel' ? 'bed' : 'pin'} size={22} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>{poi.name}</span>
                          {poi.mustSee && <span style={{ color: '#f59e0b' }}><Icon name="star" size={14} /></span>}
                          {poi.familyFriendly && <span style={{ fontSize: '11px', padding: '2px 8px', background: '#fef3c7', borderRadius: '4px', color: '#b45309' }}>Famille</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{poi.category} · {poi.price}</div>
                        <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.5, margin: 0 }}>{poi.description}</p>
                        {poi.tags && (
                          <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                            {poi.tags.slice(0, 4).map(tag => (
                              <span key={tag} style={{ fontSize: '11px', padding: '3px 8px', background: '#f1f5f9', borderRadius: '4px', color: '#64748b' }}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={() => toggleFavorite(poi)} style={{ background: isFavorite(poi.id) ? '#fef3c7' : '#f1f5f9', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', color: isFavorite(poi.id) ? '#f59e0b' : '#9ca3af' }}>
                        <Icon name="star" size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ width: '45%', position: 'relative' }}>
              <MapView destination={explorerDest} pois={Array.isArray(explorerPois) ? explorerPois : Object.values(explorerPois).flat()} selectedPOI={null} onSelectPOI={() => {}} />
            </div>
          </div>
        )}

        {/* VUE GUIDE LONELY PLANET */}
        {sidebarTab === 'guide' && (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: '55%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb' }}>
              {/* Sélection Pays */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {COUNTRIES.map(c => (
                    <button key={c.id} onClick={() => { setGuideCountry(c.id); setGuideDest(DESTINATIONS[c.id][0]); setGuideCategory('all'); }}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: guideCountry === c.id ? getCountryColor(c.id) : '#f1f5f9', color: guideCountry === c.id ? 'white' : '#6b7280' }}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sélection Destination */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: '#fafafa' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {DESTINATIONS[guideCountry]?.map(d => {
                    const info = DESTINATION_INFO[d];
                    return (
                      <button key={d} onClick={() => { setGuideDest(d); setGuideCategory('all'); }}
                        style={{ padding: '6px 14px', borderRadius: '20px', border: guideDest === d ? '2px solid #6366f1' : '1px solid #e5e7eb', cursor: 'pointer', fontSize: '13px', background: 'white', color: guideDest === d ? '#6366f1' : '#374151', fontWeight: guideDest === d ? 600 : 400 }}>
                        {info?.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Catégories Lonely Planet */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button onClick={() => setGuideCategory('all')}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, background: guideCategory === 'all' ? '#111827' : '#f1f5f9', color: guideCategory === 'all' ? 'white' : '#6b7280' }}>
                    Tout
                  </button>
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setGuideCategory(cat.id)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', background: guideCategory === cat.id ? (cat.id === 'incontournables' ? '#fef2f2' : '#f0fdf4') : '#f1f5f9', color: guideCategory === cat.id ? cat.color : '#6b7280' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }}></span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mon Programme (mini) */}
              {myProgram.length > 0 && (
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: '#f0fdf4' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#166534' }}>Mon programme : {myProgram.length} lieu(x)</span>
                    <button onClick={() => setMyProgram([])} style={{ fontSize: '12px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Vider</button>
                  </div>
                </div>
              )}

              {/* Liste POI style Lonely Planet */}
              <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                {CATEGORIES.map(cat => {
                  const pois = POI_DATA[guideCountry]?.[guideDest]?.[cat.id] || [];
                  if (pois.length === 0) return null;
                  if (guideCategory !== 'all' && guideCategory !== cat.id) return null;

                  return (
                    <div key={cat.id} style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid ' + cat.color }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color }}></span>
                        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat.label}</h3>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>({pois.length})</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {pois.map((poi, index) => (
                          <div key={poi.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: cat.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                              {index + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{poi.name}</span>
                                {poi.familyFriendly && <span style={{ fontSize: '10px', padding: '2px 6px', background: '#fef3c7', color: '#b45309', borderRadius: '4px' }}>Famille</span>}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>{poi.category} · {poi.price}</div>
                              <p style={{ fontSize: '13px', color: '#4b5563', margin: 0, lineHeight: 1.5 }}>{poi.description}</p>
                            </div>
                            <button onClick={() => isInProgram(poi.id) ? removeFromProgram(poi.id) : addToProgram({ ...poi, categoryId: cat.id, categoryLabel: cat.label, categoryColor: cat.color, destination: guideDest, country: guideCountry })}
                              style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, background: isInProgram(poi.id) ? '#dcfce7' : '#f1f5f9', color: isInProgram(poi.id) ? '#16a34a' : '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name={isInProgram(poi.id) ? 'check' : 'plus'} size={14} />
                              {isInProgram(poi.id) ? 'Ajouté' : 'Ajouter'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Carte */}
            <div style={{ width: '45%', position: 'relative' }}>
              <MapView destination={guideDest} pois={guidePois} selectedPOI={null} onSelectPOI={() => {}} />
            </div>
          </div>
        )}

        {/* VUE CONSTRUIRE */}
        {sidebarTab === 'construire' && (
          <ConstruireView
            onAddFavorite={toggleFavorite}
            favorites={favorites}
            apiData={apiData}
          />
        )}
      </div>
    </div>
  );
}
