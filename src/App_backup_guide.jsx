import { useState, useMemo } from 'react';
import { Icon } from './components/ui';
import { MapView } from './components/Map';
import { COUNTRIES, DESTINATIONS } from './data/config';
import { DESTINATION_INFO } from './data/destinations';
import { POI_DATA, CATEGORIES, getAllPOIForDestination, getAllPOICount } from './data/poi';
import './styles/global.css';

const TRIP_CONFIG = {
  name: 'Asie du Sud-Est 2026',
  startDate: '1 avril',
  endDate: '25 juin',
  totalDays: 86,
  budget: 30000,
};

const TRIP_DESTINATIONS = [
  { id: 'el-nido', country: 'philippines', nights: 6, startDay: 1 },
  { id: 'port-barton', country: 'philippines', nights: 3, startDay: 7 },
  { id: 'bohol', country: 'philippines', nights: 5, startDay: 10 },
  { id: 'moalboal', country: 'philippines', nights: 6, startDay: 15 },
  { id: 'bangkok', country: 'thailande', nights: 5, startDay: 21 },
  { id: 'chiang-mai', country: 'thailande', nights: 7, startDay: 26 },
  { id: 'koh-lanta', country: 'thailande', nights: 8, startDay: 33 },
  { id: 'hoi-an', country: 'vietnam', nights: 5, startDay: 41 },
  { id: 'ninh-binh', country: 'vietnam', nights: 3, startDay: 46 },
  { id: 'hanoi', country: 'vietnam', nights: 4, startDay: 49 },
  { id: 'ubud', country: 'bali', nights: 10, startDay: 53 },
  { id: 'sanur', country: 'bali', nights: 6, startDay: 63 },
  { id: 'nusa-penida', country: 'bali', nights: 4, startDay: 69 },
  { id: 'canggu', country: 'bali', nights: 14, startDay: 73 },
];

export default function App() {
  const [sidebarTab, setSidebarTab] = useState('guide');
  const [selectedCountry, setSelectedCountry] = useState('philippines');
  const [selectedDest, setSelectedDest] = useState('el-nido');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [myProgram, setMyProgram] = useState([]);
  const [showProgram, setShowProgram] = useState(false);

  const totalPOI = getAllPOICount();
  
  const currentPOIs = useMemo(() => {
    if (selectedCategory === 'all') {
      return getAllPOIForDestination(selectedCountry, selectedDest);
    }
    const pois = POI_DATA[selectedCountry]?.[selectedDest]?.[selectedCategory] || [];
    const cat = CATEGORIES.find(c => c.id === selectedCategory);
    return pois.map(poi => ({ ...poi, categoryId: selectedCategory, categoryLabel: cat?.label, categoryColor: cat?.color }));
  }, [selectedCountry, selectedDest, selectedCategory]);

  const addToProgram = (poi) => {
    if (!myProgram.find(p => p.id === poi.id)) {
      setMyProgram([...myProgram, { ...poi, destination: selectedDest, country: selectedCountry }]);
    }
  };

  const removeFromProgram = (poiId) => {
    setMyProgram(myProgram.filter(p => p.id !== poiId));
  };

  const isInProgram = (poiId) => myProgram.some(p => p.id === poiId);

  const getCountryColor = (country) => {
    const colors = { philippines: '#3b82f6', thailande: '#ef4444', vietnam: '#f59e0b', bali: '#22c55e' };
    return colors[country] || '#6b7280';
  };

  const getCategoryIcon = (catId) => {
    const icons = { incontournables: 'star', voir: 'map', activites: 'activity', seLoger: 'bed', seRestaurer: 'utensils', prendreUnVerre: 'glass' };
    return icons[catId] || 'pin';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <aside style={{ width: '72px', background: 'white', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', gap: '8px' }}>
        <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #dc2626, #16a34a)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px', marginBottom: '20px' }}>LP</div>
        
        <button onClick={() => { setSidebarTab('guide'); setShowProgram(false); }} style={{ width: '48px', height: '48px', borderRadius: '12px', border: 'none', background: sidebarTab === 'guide' && !showProgram ? '#fef2f2' : 'transparent', color: sidebarTab === 'guide' && !showProgram ? '#dc2626' : '#6b7280', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', fontSize: '9px', fontWeight: 500 }}>
          <Icon name="map" size={20} />
          <span>Guide</span>
        </button>

        <button onClick={() => setShowProgram(true)} style={{ width: '48px', height: '48px', borderRadius: '12px', border: 'none', background: showProgram ? '#ecfdf5' : 'transparent', color: showProgram ? '#16a34a' : '#6b7280', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', fontSize: '9px', fontWeight: 500, position: 'relative' }}>
          <Icon name="check" size={20} />
          <span>Mon prog</span>
          {myProgram.length > 0 && (
            <span style={{ position: 'absolute', top: '4px', right: '4px', width: '18px', height: '18px', background: '#16a34a', color: 'white', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{myProgram.length}</span>
          )}
        </button>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>{TRIP_CONFIG.name}</h1>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>{TRIP_CONFIG.startDate} - {TRIP_CONFIG.endDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Points d'intérêt</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{totalPOI}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Mon programme</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a' }}>{myProgram.length}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        {showProgram ? (
          /* MON PROGRAMME */
          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="check" size={22} />
              Mon Programme ({myProgram.length} éléments)
            </h2>
            
            {myProgram.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <p style={{ color: '#6b7280', marginBottom: '8px' }}>Votre programme est vide</p>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>Parcourez le guide et ajoutez des lieux qui vous intéressent</p>
                <button onClick={() => setShowProgram(false)} style={{ marginTop: '16px', padding: '10px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
                  Explorer le guide
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {TRIP_DESTINATIONS.map(dest => {
                  const destPOIs = myProgram.filter(p => p.destination === dest.id);
                  if (destPOIs.length === 0) return null;
                  const info = DESTINATION_INFO[dest.id];
                  return (
                    <div key={dest.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                      <div style={{ padding: '12px 16px', background: getCountryColor(dest.country), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600 }}>{info?.name}</span>
                        <span style={{ fontSize: '13px', opacity: 0.9 }}>{destPOIs.length} sélectionné(s)</span>
                      </div>
                      <div style={{ padding: '12px' }}>
                        {destPOIs.map(poi => (
                          <div key={poi.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', marginBottom: '8px', background: '#f9fafb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: poi.categoryColor || '#6b7280' }}></span>
                              <div>
                                <div style={{ fontWeight: 500, fontSize: '14px' }}>{poi.name}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{poi.categoryLabel}</div>
                              </div>
                            </div>
                            <button onClick={() => removeFromProgram(poi.id)} style={{ background: '#fef2f2', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#dc2626', fontSize: '12px' }}>
                              Retirer
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
        ) : (
          /* GUIDE LONELY PLANET */
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Left - Liste */}
            <div style={{ width: '55%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb' }}>
              
              {/* Sélection Pays */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {COUNTRIES.map(c => (
                    <button key={c.id} onClick={() => { setSelectedCountry(c.id); setSelectedDest(DESTINATIONS[c.id][0]); setSelectedCategory('all'); }}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: selectedCountry === c.id ? getCountryColor(c.id) : '#f3f4f6', color: selectedCountry === c.id ? 'white' : '#6b7280' }}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sélection Destination */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: '#fafafa' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {DESTINATIONS[selectedCountry]?.map(d => {
                    const info = DESTINATION_INFO[d];
                    return (
                      <button key={d} onClick={() => { setSelectedDest(d); setSelectedCategory('all'); }}
                        style={{ padding: '6px 14px', borderRadius: '20px', border: selectedDest === d ? '2px solid ' + getCountryColor(selectedCountry) : '1px solid #e5e7eb', cursor: 'pointer', fontSize: '13px', background: 'white', color: selectedDest === d ? getCountryColor(selectedCountry) : '#374151', fontWeight: selectedDest === d ? 600 : 400 }}>
                        {info?.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Catégories Lonely Planet */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button onClick={() => setSelectedCategory('all')}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, background: selectedCategory === 'all' ? '#111827' : '#f3f4f6', color: selectedCategory === 'all' ? 'white' : '#6b7280' }}>
                    Tout
                  </button>
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', background: selectedCategory === cat.id ? (cat.id === 'incontournables' ? '#fef2f2' : '#f0fdf4') : '#f3f4f6', color: selectedCategory === cat.id ? cat.color : '#6b7280' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }}></span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Liste POI style Lonely Planet */}
              <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                {CATEGORIES.map(cat => {
                  const pois = POI_DATA[selectedCountry]?.[selectedDest]?.[cat.id] || [];
                  if (pois.length === 0) return null;
                  if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
                  
                  return (
                    <div key={cat.id} style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid ' + cat.color }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color }}></span>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat.label}</h3>
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
                            <button onClick={() => isInProgram(poi.id) ? removeFromProgram(poi.id) : addToProgram({ ...poi, categoryId: cat.id, categoryLabel: cat.label, categoryColor: cat.color })}
                              style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, background: isInProgram(poi.id) ? '#dcfce7' : '#f3f4f6', color: isInProgram(poi.id) ? '#16a34a' : '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
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

            {/* Right - Map */}
            <div style={{ width: '45%', position: 'relative' }}>
              <MapView 
                destination={selectedDest} 
                pois={currentPOIs}
                selectedPOI={null}
                onSelectPOI={() => {}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
