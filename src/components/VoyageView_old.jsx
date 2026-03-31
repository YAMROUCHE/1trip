import React, { useState, useEffect } from 'react';

const API_URL = 'https://tripflow-api.youssef-amrouche.workers.dev';

// Icônes SVG
const Icons = {
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Hotel: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Save: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Plane: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
};

// Composant pour les étoiles d'hôtel
const HotelStars = ({ count }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[...Array(count || 0)].map((_, i) => (
      <Icons.Star key={i} />
    ))}
  </div>
);

// Labels des créneaux
const slotLabels = {
  matin: { label: '🌅 Matin', bg: '#ffffff' },
  petit_dej: { label: '🍳 Petit-déj', bg: '#fef3c7' },
  aprem: { label: '☀️ Après-midi', bg: '#ffffff' },
  dejeuner: { label: '🍜 Déjeuner', bg: '#fef3c7' },
  soir: { label: '🌙 Soir', bg: '#ffffff' },
  diner: { label: '🍽️ Dîner', bg: '#fef3c7' }
};

const slotOrder = ['matin', 'petit_dej', 'aprem', 'dejeuner', 'soir', 'diner'];

// Composant pour afficher les activités d'un jour
const DayActivities = ({ activities, dayId, onEditActivity }) => {
  if (!activities) return null;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '8px',
      marginTop: '12px',
      padding: '12px',
      background: '#f9fafb',
      borderRadius: '8px'
    }}>
      {slotOrder.map(slot => {
        const slotActivities = activities[slot] || [];
        if (slotActivities.length === 0) return null;
        
        const info = slotLabels[slot];
        return (
          <div 
            key={slot}
            style={{
              padding: '10px',
              background: info.bg,
              borderRadius: '6px',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px' }}>
              {info.label}
            </div>
            {slotActivities.map((activity, idx) => (
              <div key={idx} style={{ marginBottom: '4px' }}>
                <div style={{ fontWeight: '500', fontSize: '14px', color: '#1f2937' }}>
                  {activity.name}
                </div>
                {activity.description && (
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {activity.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

// Composant principal
const VoyageView = () => {
  const [days, setDays] = useState([]);
  const [stats, setStats] = useState({});
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCountries, setExpandedCountries] = useState({});
  const [expandedDay, setExpandedDay] = useState(null);
  const [dayActivities, setDayActivities] = useState({});
  
  // État pour l'édition d'hôtel
  const [editingHotel, setEditingHotel] = useState(null);
  const [hotelsForDestination, setHotelsForDestination] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Filtres
  const [filters, setFilters] = useState({
    country: 'all',
    type: 'all',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [daysRes, statsRes, choicesRes] = await Promise.all([
        fetch(`${API_URL}/api/voyage/days`),
        fetch(`${API_URL}/api/voyage/stats`),
        fetch(`${API_URL}/api/voyage/choices`)
      ]);

      const daysData = await daysRes.json();
      const statsData = await statsRes.json();
      const choicesData = await choicesRes.json();

      setDays(daysData.days || []);
      setStats(statsData);
      setChoices(choicesData.choices || []);

      // Ouvrir tous les pays par défaut
      const countries = {};
      (statsData.by_country || []).forEach(c => {
        countries[c.country] = true;
      });
      setExpandedCountries(countries);
    } catch (err) {
      setError('Erreur de chargement: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les activités d'un jour
  const loadDayActivities = async (dayId) => {
    if (dayActivities[dayId]) return; // Déjà en cache
    
    try {
      const res = await fetch(`${API_URL}/api/voyage/days/${dayId}`);
      const data = await res.json();
      setDayActivities(prev => ({
        ...prev,
        [dayId]: data.activities || {}
      }));
    } catch (err) {
      console.error('Erreur chargement activités:', err);
    }
  };

  // Charger les hôtels d'une destination
  const loadHotels = async (destination) => {
    setLoadingHotels(true);
    try {
      // Convertir le nom de destination en ID
      const destId = destination.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/→.*/g, '')
        .trim();
      
      const res = await fetch(`${API_URL}/api/hotels?destination_id=${destId}`);
      const data = await res.json();
      setHotelsForDestination(data.hotels || []);
    } catch (err) {
      console.error('Erreur chargement hôtels:', err);
      setHotelsForDestination([]);
    } finally {
      setLoadingHotels(false);
    }
  };

  // Toggle jour (ouvrir/fermer + charger activités)
  const toggleDay = async (dayId) => {
    if (expandedDay === dayId) {
      setExpandedDay(null);
    } else {
      setExpandedDay(dayId);
      await loadDayActivities(dayId);
    }
  };

  // Commencer l'édition d'hôtel
  const startEditHotel = async (day) => {
    setEditingHotel(day.id);
    setSelectedHotel(null);
    await loadHotels(day.destination);
  };

  // Sélectionner un hôtel
  const selectHotel = (hotel) => {
    setSelectedHotel(hotel);
  };

  // Sauvegarder l'hôtel
  const saveHotel = async (dayId) => {
    if (!selectedHotel) return;
    
    try {
      const response = await fetch(`${API_URL}/api/voyage/days/${dayId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotel_name: selectedHotel.name,
          hotel_price: selectedHotel.price_night,
          hotel_stars: selectedHotel.stars
        })
      });

      if (response.ok) {
        setEditingHotel(null);
        setSelectedHotel(null);
        setHotelsForDestination([]);
        loadData();
      }
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  // Annuler l'édition
  const cancelEditHotel = () => {
    setEditingHotel(null);
    setSelectedHotel(null);
    setHotelsForDestination([]);
  };

  // Toggle pays
  const toggleCountry = (country) => {
    setExpandedCountries(prev => ({
      ...prev,
      [country]: !prev[country]
    }));
  };

  // Grouper les jours par pays
  const daysByCountry = days.reduce((acc, day) => {
    if (!acc[day.country]) {
      acc[day.country] = {
        flag: day.country_flag,
        days: []
      };
    }
    acc[day.country].days.push(day);
    return acc;
  }, {});

  // Filtrer les jours
  const filteredDaysByCountry = Object.entries(daysByCountry).reduce((acc, [country, data]) => {
    if (filters.country !== 'all' && country !== filters.country) return acc;
    
    let filteredDays = data.days;
    
    if (filters.type === 'transition') {
      filteredDays = filteredDays.filter(d => d.is_transition === 1);
    } else if (filters.type === 'highlight') {
      filteredDays = filteredDays.filter(d => d.is_highlight === 1);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredDays = filteredDays.filter(d => 
        d.destination.toLowerCase().includes(search) ||
        (d.hotel_name && d.hotel_name.toLowerCase().includes(search))
      );
    }
    
    if (filteredDays.length > 0) {
      acc[country] = { ...data, days: filteredDays };
    }
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
        <p>Chargement du voyage...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>❌</div>
        <p>{error}</p>
        <button onClick={loadData} style={{ marginTop: '10px', padding: '8px 16px', background: '#14b8a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#14b8a6' }}>{stats.total_days || 0}</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Jours</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316' }}>{stats.total_countries || 0}</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Pays</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.total_destinations || 0}</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Destinations</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{stats.total_budget?.toLocaleString() || 0}€</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Budget hôtels</div>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <select
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white' }}
        >
          <option value="all">Tous les pays</option>
          {Object.keys(daysByCountry).map(country => (
            <option key={country} value={country}>{daysByCountry[country].flag} {country}</option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white' }}
        >
          <option value="all">Tous les jours</option>
          <option value="transition">Transitions</option>
          <option value="highlight">Highlights</option>
        </select>

        <input
          type="text"
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', flex: 1, minWidth: '200px' }}
        />
      </div>

      {/* Liste des jours par pays */}
      {Object.entries(filteredDaysByCountry).map(([country, { flag, days: countryDays }]) => (
        <div key={country} style={{ marginBottom: '24px' }}>
          {/* Header pays */}
          <button
            onClick={() => toggleCountry(country)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>{flag}</span>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>{country}</span>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>({countryDays.length} jours)</span>
            </div>
            {expandedCountries[country] ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
          </button>

          {/* Liste des jours */}
          {expandedCountries[country] && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {countryDays.map(day => (
                <div 
                  key={day.id}
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    border: `1px solid ${day.is_highlight ? '#fbbf24' : '#e5e7eb'}`,
                    overflow: 'hidden'
                  }}
                >
                  {/* Header du jour */}
                  <div
                    onClick={() => toggleDay(day.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      cursor: 'pointer',
                      background: expandedDay === day.id ? '#f9fafb' : 'white'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontWeight: 'bold', color: '#14b8a6', fontSize: '18px' }}>J{day.day_number}</div>
                      <div>
                        <div style={{ fontWeight: '500' }}>{day.destination}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{day.date}</div>
                      </div>
                      {day.is_transition === 1 && (
                        <span style={{ padding: '2px 8px', background: '#dbeafe', color: '#1d4ed8', fontSize: '12px', borderRadius: '999px' }}>
                          Transit
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {day.hotel_name && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', fontWeight: '500' }}>{day.hotel_name}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{day.hotel_price}€/nuit</div>
                        </div>
                      )}
                      {expandedDay === day.id ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
                    </div>
                  </div>

                  {/* Contenu étendu */}
                  {expandedDay === day.id && (
                    <div style={{ padding: '0 16px 16px' }}>
                      {/* Section Hébergement */}
                      <div style={{ 
                        padding: '12px', 
                        background: '#f0fdf4', 
                        borderRadius: '8px',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Icons.Hotel />
                            Hébergement
                          </div>
                          {editingHotel !== day.id && (
                            <button
                              onClick={(e) => { e.stopPropagation(); startEditHotel(day); }}
                              style={{
                                padding: '4px 12px',
                                background: '#14b8a6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Changer
                            </button>
                          )}
                        </div>

                        {editingHotel === day.id ? (
                          <div>
                            {loadingHotels ? (
                              <div style={{ padding: '20px', textAlign: 'center' }}>Chargement des hôtels...</div>
                            ) : hotelsForDestination.length === 0 ? (
                              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                                Aucun hôtel trouvé pour cette destination
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {hotelsForDestination.map(hotel => (
                                  <div
                                    key={hotel.id}
                                    onClick={() => selectHotel(hotel)}
                                    style={{
                                      padding: '12px',
                                      background: selectedHotel?.id === hotel.id ? '#d1fae5' : '#f9fafb',
                                      border: selectedHotel?.id === hotel.id ? '2px solid #14b8a6' : '1px solid #e5e7eb',
                                      borderRadius: '6px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                      <div>
                                        <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          {hotel.name}
                                          {hotel.recommande === 1 && (
                                            <span style={{ fontSize: '10px', padding: '2px 6px', background: '#fef3c7', color: '#92400e', borderRadius: '4px' }}>
                                              Recommandé
                                            </span>
                                          )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                          <HotelStars count={hotel.stars} />
                                        </div>
                                        {hotel.description && (
                                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                            {hotel.description}
                                          </div>
                                        )}
                                      </div>
                                      <div style={{ fontWeight: '600', color: '#14b8a6' }}>
                                        {hotel.price_night}€
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                
                                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                  <button
                                    onClick={() => saveHotel(day.id)}
                                    disabled={!selectedHotel}
                                    style={{
                                      flex: 1,
                                      padding: '8px',
                                      background: selectedHotel ? '#14b8a6' : '#d1d5db',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      cursor: selectedHotel ? 'pointer' : 'not-allowed'
                                    }}
                                  >
                                    Sauver
                                  </button>
                                  <button
                                    onClick={cancelEditHotel}
                                    style={{
                                      flex: 1,
                                      padding: '8px',
                                      background: '#f3f4f6',
                                      color: '#374151',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '6px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            {day.hotel_name ? (
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ fontWeight: '500' }}>{day.hotel_name}</div>
                                  {day.hotel_stars && <HotelStars count={day.hotel_stars} />}
                                </div>
                                <div style={{ fontWeight: '600', color: '#14b8a6' }}>{day.hotel_price}€/nuit</div>
                              </div>
                            ) : (
                              <div style={{ color: '#6b7280', fontStyle: 'italic' }}>Aucun hôtel sélectionné</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Section Activités */}
                      <div style={{ fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icons.Calendar />
                        Programme du jour
                      </div>
                      <DayActivities 
                        activities={dayActivities[day.id]} 
                        dayId={day.id}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VoyageView;
