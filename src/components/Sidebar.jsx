/**
 * Sidebar - Navigation dépliante style Render.com
 */

export function Sidebar({ 
  isOpen, 
  onToggle, 
  activeTab, 
  onTabChange 
}) {
  const menuItems = [
    { id: 'accueil', label: 'Accueil', icon: 'home' },
    { id: 'explorer', label: 'Explorer', icon: 'map' },
    { id: 'monvoyage', label: 'Mon Voyage', icon: 'calendar' },
    { id: 'favoris', label: 'Favoris', icon: 'star' },
  ];

  const icons = {
    home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    map: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16"/><path d="M16 6v16"/></svg>,
    calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>,
    star: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    chevronLeft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
    chevronRight: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  };

  return (
    <aside style={{
      width: isOpen ? '200px' : '72px',
      background: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '56px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: '#6366f1',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '14px',
          flexShrink: 0,
        }}>
          TF
        </div>
        {isOpen && (
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>TripFlow</span>
        )}
      </div>

      {/* Menu Items */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isOpen ? '10px 12px' : '10px',
              justifyContent: isOpen ? 'flex-start' : 'center',
              background: activeTab === item.id ? '#f3f4f6' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: activeTab === item.id ? '#6366f1' : '#6b7280',
              transition: 'all 0.15s',
              width: '100%',
            }}
            onMouseOver={(e) => {
              if (activeTab !== item.id) {
                e.currentTarget.style.background = '#f9fafb';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== item.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span style={{ flexShrink: 0 }}>{icons[item.icon]}</span>
            {isOpen && (
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Toggle Button */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={onToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: isOpen ? '10px 12px' : '10px',
            justifyContent: isOpen ? 'flex-start' : 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#9ca3af',
            transition: 'all 0.15s',
            width: '100%',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ flexShrink: 0 }}>{isOpen ? icons.chevronLeft : icons.chevronRight}</span>
          {isOpen && (
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Réduire</span>
          )}
        </button>
      </div>
    </aside>
  );
}
