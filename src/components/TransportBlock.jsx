import React, { useState, useEffect } from 'react';

const Icon = ({ name, size = 20, color = 'currentColor' }) => {
  const icons = {
    plane: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>),
    bus: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6v6" /><path d="M16 6v6" /><path d="M2 12h20" /><path d="M7 18h.01" /><path d="M17 18h.01" /><rect x="3" y="4" width="18" height="16" rx="2" /></svg>),
    train: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="16" rx="2" /><path d="M4 11h16" /><path d="M12 3v8" /><path d="M8 19l-2 3" /><path d="M18 22l-2-3" /><path d="M8 15h.01" /><path d="M16 15h.01" /></svg>),
    ship: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" /><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" /><path d="M12 10v4" /><path d="M12 2v3" /></svg>),
    car: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>),
    clock: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>),
    euro: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12" /><path d="M4 14h9" /><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12a7.9 7.9 0 0 0 7.8 8 7.7 7.7 0 0 0 5.2-2" /></svg>),
    link: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>),
    check: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>),
    chevronDown: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>),
    arrowDown: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>)
  };
  return icons[name] || icons.bus;
};

const getTransportIcon = (type) => {
  const typeMap = {
    'avion': 'plane',
    'bus': 'bus',
    'train': 'train',
    'ferry': 'ship',
    'bateau': 'ship',
    'van': 'bus',
    'minivan': 'bus',
    'voiture': 'car',
    'taxi': 'car',
    'scooter': 'car',
    'bus+ferry': 'ship'
  };
  return typeMap[type] || 'bus';
};

const API_URL = 'https://tripflow-api.youssef-amrouche.workers.dev';

export const TransportBlock = ({ 
  fromDestination, 
  toDestination, 
  onSelect,
  selectedTransport = null 
}) => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(!selectedTransport);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!fromDestination || !toDestination) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/api/transports?from=${fromDestination}&to=${toDestination}`
        );
        const data = await response.json();
        setConnections(data.connections || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching transports:', err);
        setError('Impossible de charger les transports');
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [fromDestination, toDestination]);

  const formatDuration = (hours) => {
    if (!hours) return '';
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    if (hours === Math.floor(hours)) return `${hours}h`;
    return `${Math.floor(hours)}h${Math.round((hours % 1) * 60)}`;
  };

  const formatDestinationName = (id) => {
    if (!id) return '';
    return id.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const styles = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '8px 0',
      position: 'relative'
    },
    connector: {
      width: '2px',
      height: '16px',
      background: '#E5E7EB'
    },
    container: {
      width: '100%',
      maxWidth: '600px',
      background: '#F9FAFB',
      border: '1px dashed #D1D5DB',
      borderRadius: '12px',
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      cursor: 'pointer',
      background: selectedTransport ? '#F0FDFA' : 'transparent'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    headerTitle: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#6B7280',
      margin: 0
    },
    headerSelected: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: '#14B8A6',
      fontWeight: '500'
    },
    chevron: {
      transition: 'transform 0.2s ease',
      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
    },
    content: {
      padding: expanded ? '0 16px 16px' : '0',
      maxHeight: expanded ? '400px' : '0',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    optionsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    optionSelected: {
      borderColor: '#14B8A6',
      background: '#F0FDFA'
    },
    optionIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      background: '#F3F4F6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    optionIconSelected: {
      background: '#CCFBF1'
    },
    optionInfo: {
      flex: 1
    },
    optionType: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827',
      margin: '0 0 2px 0',
      textTransform: 'capitalize'
    },
    optionCompany: {
      fontSize: '12px',
      color: '#6B7280',
      margin: 0
    },
    optionMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '13px',
      color: '#6B7280'
    },
    optionPrice: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#14B8A6'
    },
    selectBtn: {
      padding: '6px 12px',
      background: '#14B8A6',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    selectedBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px 12px',
      background: '#D1FAE5',
      color: '#10B981',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500'
    },
    bookingLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '12px',
      padding: '8px 12px',
      background: '#EEF2FF',
      borderRadius: '6px',
      fontSize: '12px',
      color: '#6366F1',
      textDecoration: 'none'
    },
    loading: {
      padding: '20px',
      textAlign: 'center',
      color: '#6B7280',
      fontSize: '13px'
    },
    noConnections: {
      padding: '16px',
      textAlign: 'center',
      color: '#9CA3AF',
      fontSize: '13px'
    }
  };

  if (!fromDestination || !toDestination) {
    return null;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.connector} />
      
      <div style={styles.container}>
        <div style={styles.header} onClick={() => setExpanded(!expanded)}>
          <div style={styles.headerLeft}>
            <Icon name="arrowDown" size={16} color="#9CA3AF" />
            <p style={styles.headerTitle}>
              Transport vers {formatDestinationName(toDestination)}
            </p>
          </div>
          
          {selectedTransport && !expanded ? (
            <div style={styles.headerSelected}>
              <Icon name={getTransportIcon(selectedTransport.transport_type)} size={16} color="#14B8A6" />
              <span>{selectedTransport.transport_type} · {selectedTransport.estimated_cost_eur}€</span>
            </div>
          ) : (
            <div style={styles.chevron}>
              <Icon name="chevronDown" size={18} color="#9CA3AF" />
            </div>
          )}
        </div>

        <div style={styles.content}>
          {loading ? (
            <div style={styles.loading}>Chargement des options...</div>
          ) : error ? (
            <div style={styles.noConnections}>{error}</div>
          ) : connections.length === 0 ? (
            <div style={styles.noConnections}>
              Aucune connexion directe trouvée
            </div>
          ) : (
            <>
              <div style={styles.optionsList}>
                {connections.map((conn) => {
                  const isSelected = selectedTransport?.id === conn.id;
                  return (
                    <div 
                      key={conn.id} 
                      style={{
                        ...styles.option,
                        ...(isSelected ? styles.optionSelected : {})
                      }}
                      onClick={() => !isSelected && onSelect && onSelect(conn)}
                    >
                      <div style={{
                        ...styles.optionIcon,
                        ...(isSelected ? styles.optionIconSelected : {})
                      }}>
                        <Icon 
                          name={getTransportIcon(conn.transport_type)} 
                          size={20} 
                          color={isSelected ? '#14B8A6' : '#6B7280'} 
                        />
                      </div>
                      
                      <div style={styles.optionInfo}>
                        <p style={styles.optionType}>{conn.transport_type}</p>
                        {conn.company && (
                          <p style={styles.optionCompany}>{conn.company}</p>
                        )}
                      </div>
                      
                      <div style={styles.optionMeta}>
                        {conn.duration_hours && (
                          <div style={styles.metaItem}>
                            <Icon name="clock" size={14} color="#9CA3AF" />
                            <span>{formatDuration(conn.duration_hours)}</span>
                          </div>
                        )}
                        <span style={styles.optionPrice}>
                          {conn.estimated_cost_eur}€
                        </span>
                      </div>
                      
                      {isSelected ? (
                        <div style={styles.selectedBadge}>
                          <Icon name="check" size={14} color="#10B981" />
                          <span>Choisi</span>
                        </div>
                      ) : (
                        <button 
                          style={styles.selectBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect && onSelect(conn);
                          }}
                        >
                          Choisir
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {connections[0]?.booking_url && (
                <a 
                  href={connections[0].booking_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.bookingLink}
                >
                  <Icon name="link" size={14} color="#6366F1" />
                  <span>Réserver sur {new URL(connections[0].booking_url).hostname}</span>
                </a>
              )}
            </>
          )}
        </div>
      </div>
      
      <div style={styles.connector} />
    </div>
  );
};

export default TransportBlock;
