import React, { useState, useEffect } from 'react';

// ============================================
// ICÔNES SVG SOBRES
// ============================================
const Icons = {
  plane: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
    </svg>
  ),
  car: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/>
      <circle cx="17" cy="17" r="2"/>
      <path d="M14 17H10"/>
    </svg>
  ),
  bike: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18.5" cy="17.5" r="3.5"/>
      <circle cx="5.5" cy="17.5" r="3.5"/>
      <circle cx="15" cy="5" r="1"/>
      <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
    </svg>
  ),
  bus: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6v6"/>
      <path d="M16 6v6"/>
      <path d="M2 12h20"/>
      <path d="M18 18h2a1 1 0 001-1v-7a6 6 0 00-6-6H9a6 6 0 00-6 6v7a1 1 0 001 1h2"/>
      <circle cx="7" cy="18" r="2"/>
      <circle cx="17" cy="18" r="2"/>
    </svg>
  ),
  train: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="16" rx="2"/>
      <path d="M4 11h16"/>
      <path d="M12 3v8"/>
      <path d="M8 19l-2 3"/>
      <path d="M18 22l-2-3"/>
      <circle cx="8" cy="15" r="1"/>
      <circle cx="16" cy="15" r="1"/>
    </svg>
  ),
  map: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  euro: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12"/>
      <path d="M4 14h12"/>
      <path d="M19 6c-1.5-1.5-3.5-2-6-2-5 0-9 4-9 9s4 9 9 9c2.5 0 4.5-.5 6-2"/>
    </svg>
  ),
  externalLink: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  alertCircle: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  users: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  arrowRight: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
};

const TransportView = () => {
  const [activeTab, setActiveTab] = useState('vols');
  const [flights, setFlights] = useState([]);
  const [localTransport, setLocalTransport] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('all');

  const API_URL = 'https://tripflow-api.youssef-amrouche.workers.dev';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const flightsRes = await fetch(`${API_URL}/api/international-flights`);
        if (flightsRes.ok) {
          const data = await flightsRes.json();
          setFlights(data);
        }
        const localRes = await fetch(`${API_URL}/api/local-transport`);
        if (localRes.ok) {
          const data = await localRes.json();
          setLocalTransport(data);
        }
        const connRes = await fetch(`${API_URL}/api/transport-connections`);
        if (connRes.ok) {
          const data = await connRes.json();
          setConnections(data);
        }
      } catch (error) {
        console.error('Erreur chargement transports:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // ONGLET VOLS
  const VolsTab = () => {
    const getStatusStyle = (status) => {
      switch (status) {
        case 'reserve': return { bg: '#dcfce7', color: '#166534', label: 'Réservé' };
        case 'a_reserver': return { bg: '#fef3c7', color: '#92400e', label: 'À réserver' };
        case 'a_planifier': return { bg: '#e0e7ff', color: '#3730a3', label: 'À planifier' };
        default: return { bg: '#f3f4f6', color: '#374151', label: status };
      }
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return 'Date à définir';
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ color: '#14B8A6' }}>{Icons.plane}</div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Vols internationaux</h2>
          <span style={{ background: '#f0fdfa', color: '#0d9488', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>{flights.length} vols</span>
        </div>
        <div style={{ position: 'relative', paddingLeft: '30px' }}>
          <div style={{ position: 'absolute', left: '9px', top: '20px', bottom: '20px', width: '2px', background: '#e5e7eb' }} />
          {flights.map((flight, index) => {
            const status = getStatusStyle(flight.booking_status);
            return (
              <div key={flight.id} style={{ position: 'relative', marginBottom: '24px', paddingBottom: '24px', borderBottom: index < flights.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ position: 'absolute', left: '-25px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: flight.booking_status === 'reserve' ? '#10b981' : flight.booking_status === 'a_reserver' ? '#f59e0b' : '#6366f1', border: '2px solid white', boxShadow: '0 0 0 2px #e5e7eb' }} />
                <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{Icons.calendar}<span style={{ fontWeight: '500' }}>{formatDate(flight.departure_date)}</span></div>
                    <span style={{ background: status.bg, color: status.color, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>{status.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>{flight.from_airport_code}</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{flight.from_city}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#14B8A6', flex: 1 }}>
                      <div style={{ color: '#9ca3af', marginBottom: '4px' }}>{Icons.arrowRight}</div>
                      {flight.duration_hours && <span style={{ fontSize: '12px', color: '#9ca3af' }}>{flight.duration_hours}h</span>}
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>{flight.to_airport_code}</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{flight.to_city}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', paddingTop: '12px', borderTop: '1px solid #f3f4f6', fontSize: '13px', color: '#6b7280' }}>
                    {flight.airline && <span>{flight.airline}</span>}
                    {flight.price_eur && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.euro} {flight.price_eur}€</span>}
                    {flight.notes && <span style={{ fontStyle: 'italic' }}>{flight.notes}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {flights.length === 0 && !loading && <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Aucun vol enregistré.</div>}
      </div>
    );
  };

  // ONGLET TRANSFERTS
  const TransfertsTab = () => {
    const countries = [
      { id: 'all', label: 'Tous les pays' },
      { id: 'philippines', label: 'Philippines' },
      { id: 'thailande', label: 'Thaïlande' },
      { id: 'vietnam', label: 'Vietnam' },
      { id: 'bali', label: 'Bali' }
    ];
    const filteredTransport = selectedCountry === 'all' ? localTransport : localTransport.filter(t => t.country === selectedCountry);
    const familyFriendly = filteredTransport.filter(t => t.family_friendly);
    const soloOnly = filteredTransport.filter(t => !t.family_friendly);
    const getTransportIcon = (type) => {
      switch (type) {
        case 'voiture': case 'taxi': return Icons.car;
        case 'moto': return Icons.bike;
        case 'metro': case 'train': return Icons.train;
        default: return Icons.bus;
      }
    };
    const TransportCard = ({ transport }) => (
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: '#14B8A6', background: '#f0fdfa', padding: '8px', borderRadius: '8px' }}>{getTransportIcon(transport.transport_type)}</div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '15px' }}>{transport.app_name}</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{transport.transport_type}</div>
            </div>
          </div>
          {transport.family_friendly ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>{Icons.users} Famille OK</span>
          ) : (
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>Solo</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '14px' }}>
          {transport.base_fare_eur && <div><span style={{ color: '#6b7280' }}>Base: </span><span style={{ fontWeight: '500' }}>{transport.base_fare_eur}€</span></div>}
          {transport.price_per_km_eur && <div><span style={{ color: '#6b7280' }}>Par km: </span><span style={{ fontWeight: '500' }}>{transport.price_per_km_eur}€</span></div>}
          {transport.availability && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.clock}<span>{transport.availability}</span></div>}
        </div>
        {transport.notes && <div style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic', marginBottom: '12px' }}>{transport.notes}</div>}
        {transport.app_url && (
          <a href={transport.app_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#14B8A6', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Ouvrir {transport.app_name} {Icons.externalLink}
          </a>
        )}
      </div>
    );
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ color: '#14B8A6' }}>{Icons.car}</div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Transferts et taxis</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {countries.map(country => (
            <button key={country.id} onClick={() => setSelectedCountry(country.id)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', background: selectedCountry === country.id ? '#14B8A6' : '#f3f4f6', color: selectedCountry === country.id ? 'white' : '#374151', transition: 'all 0.2s' }}>
              {country.label}
            </button>
          ))}
        </div>
        {familyFriendly.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>{Icons.users} Adaptés pour la famille ({familyFriendly.length})</h3>
            {familyFriendly.map(t => <TransportCard key={t.id} transport={t} />)}
          </div>
        )}
        {soloOnly.length > 0 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#6b7280' }}>Solo uniquement ({soloOnly.length})</h3>
            {soloOnly.map(t => <TransportCard key={t.id} transport={t} />)}
          </div>
        )}
        {filteredTransport.length === 0 && !loading && <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Aucun transport trouvé pour ce pays.</div>}
      </div>
    );
  };

  // ONGLET CONNEXIONS
  const QuotidienTab = () => {
    const [selectedFrom, setSelectedFrom] = useState('');
    const destinations = [...new Set([...connections.map(c => c.from_destination), ...connections.map(c => c.to_destination)])].sort();
    const filteredConnections = selectedFrom ? connections.filter(c => c.from_destination === selectedFrom) : connections.slice(0, 20);
    const getTypeIcon = (type) => {
      const t = type?.toLowerCase() || '';
      if (t.includes('avion')) return Icons.plane;
      if (t.includes('bus') || t.includes('van')) return Icons.bus;
      if (t.includes('train')) return Icons.train;
      if (t.includes('ferry') || t.includes('bateau')) return Icons.map;
      return Icons.car;
    };
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ color: '#14B8A6' }}>{Icons.map}</div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Connexions inter-destinations</h2>
          <span style={{ background: '#f0fdfa', color: '#0d9488', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>{connections.length} trajets</span>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Filtrer par point de départ :</label>
          <select value={selectedFrom} onChange={(e) => setSelectedFrom(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', minWidth: '250px', cursor: 'pointer' }}>
            <option value="">-- Toutes les destinations --</option>
            {destinations.map(dest => <option key={dest} value={dest}>{dest.charAt(0).toUpperCase() + dest.slice(1).replace(/-/g, ' ')}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredConnections.map((conn, index) => (
            <div key={conn.id || index} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ color: '#14B8A6', background: '#f0fdfa', padding: '10px', borderRadius: '8px' }}>{getTypeIcon(conn.transport_type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ textTransform: 'capitalize' }}>{conn.from_destination?.replace(/-/g, ' ')}</span>
                  <span style={{ color: '#9ca3af' }}>{Icons.arrowRight}</span>
                  <span style={{ textTransform: 'capitalize' }}>{conn.to_destination?.replace(/-/g, ' ')}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', gap: '16px' }}>
                  <span style={{ textTransform: 'capitalize' }}>{conn.transport_type}</span>
                  {conn.company && <span>{conn.company}</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                {conn.duration_hours && <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>{Icons.clock} {conn.duration_hours}h</div>}
                {conn.estimated_cost_eur && <div style={{ color: '#14B8A6', fontSize: '14px', fontWeight: '500' }}>{conn.estimated_cost_eur}€</div>}
              </div>
            </div>
          ))}
        </div>
        {filteredConnections.length === 0 && !loading && <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Aucune connexion trouvée.</div>}
        {!selectedFrom && connections.length > 20 && <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', fontSize: '14px' }}>Affichage des 20 premières. Sélectionnez un point de départ pour filtrer.</div>}
      </div>
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: '4px', paddingTop: '16px' }}>
          {[
            { id: 'vols', label: 'Vols', icon: Icons.plane },
            { id: 'transferts', label: 'Transferts', icon: Icons.car },
            { id: 'quotidien', label: 'Connexions', icon: Icons.map }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #14B8A6' : '2px solid transparent', background: 'transparent', color: activeTab === tab.id ? '#14B8A6' : '#6b7280', fontWeight: activeTab === tab.id ? '600' : '400', cursor: 'pointer', transition: 'all 0.2s', fontSize: '15px' }}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#9ca3af' }}>Chargement...</div>
        ) : (
          <>
            {activeTab === 'vols' && <VolsTab />}
            {activeTab === 'transferts' && <TransfertsTab />}
            {activeTab === 'quotidien' && <QuotidienTab />}
          </>
        )}
      </div>
    </div>
  );
};

export default TransportView;
