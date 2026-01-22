/**
 * AccueilView - Dashboard pleine page, style Render.com
 */

export function AccueilView({ 
  totalNights, 
  totalCost, 
  budget, 
  destinations, 
  totalPOI, 
  favorites,
  onNavigate 
}) {
  const departDate = new Date('2026-04-01');
  const today = new Date();
  const daysUntilTrip = Math.max(0, Math.ceil((departDate - today) / (1000 * 60 * 60 * 24)));
  const budgetPercent = Math.round((totalCost / budget) * 100);

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
  };

  // Icônes SVG sobres
  const icons = {
    map: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16"/><path d="M16 6v16"/></svg>,
    calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>,
    heart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  };

  return (
    <div style={{ padding: '24px 32px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Row 1: Countdown + Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', marginBottom: '16px' }}>
        
        {/* Countdown */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Départ dans</div>
          <div style={{ fontSize: '40px', fontWeight: 600, color: '#111827', lineHeight: 1 }}>J-{daysUntilTrip}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>1 avril → 25 juin 2026</div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={cardStyle}>
            <div style={{ fontSize: '32px', fontWeight: 600, color: '#111827' }}>{totalNights}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Nuits</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: '32px', fontWeight: 600, color: '#111827' }}>{destinations.length}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Destinations</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: '32px', fontWeight: 600, color: '#111827' }}>{totalPOI.toLocaleString()}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Points d'intérêt</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: '32px', fontWeight: 600, color: '#111827' }}>4</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Pays</div>
          </div>
        </div>
      </div>

      {/* Row 2: Budget */}
      <div style={{ ...cardStyle, marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Budget estimé</div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#111827' }}>€{totalCost.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Budget total</div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#111827' }}>€{budget.toLocaleString()}</div>
          </div>
        </div>
        <div style={{ background: '#f3f4f6', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
          <div style={{ 
            background: '#6366f1', 
            height: '100%', 
            width: `${Math.min(100, budgetPercent)}%`,
            borderRadius: '4px',
          }}></div>
        </div>
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
          {budgetPercent}% utilisé · Reste €{(budget - totalCost).toLocaleString()}
        </div>
      </div>

      {/* Row 3: Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <button 
          onClick={() => onNavigate('explorer')} 
          style={{ 
            ...cardStyle, 
            cursor: 'pointer', 
            textAlign: 'left',
            transition: 'border-color 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#6366f1'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
        >
          <div style={{ width: '44px', height: '44px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb' }}>
            {icons.map}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>Explorer</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{totalPOI.toLocaleString()} lieux à découvrir</div>
          </div>
        </button>
        <button 
          onClick={() => onNavigate('monvoyage')} 
          style={{ 
            ...cardStyle, 
            cursor: 'pointer', 
            textAlign: 'left',
            transition: 'border-color 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#6366f1'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
        >
          <div style={{ width: '44px', height: '44px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb' }}>
            {icons.calendar}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>Mon Voyage</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Gérer l'itinéraire</div>
          </div>
        </button>
        <button 
          onClick={() => onNavigate('favoris')} 
          style={{ 
            ...cardStyle, 
            cursor: 'pointer', 
            textAlign: 'left',
            transition: 'border-color 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#6366f1'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
        >
          <div style={{ width: '44px', height: '44px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb' }}>
            {icons.heart}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>Favoris</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{favorites.length} lieu{favorites.length !== 1 ? 'x' : ''} sauvegardé{favorites.length !== 1 ? 's' : ''}</div>
          </div>
        </button>
      </div>
    </div>
  );
}
