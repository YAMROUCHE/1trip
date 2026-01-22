/**
 * SummaryView - Dashboard résumé style Stippl.io
 */

export function SummaryView({ 
  tripName = 'Asie du Sud-Est 2026',
  startDate = '1 avril',
  endDate = '25 juin',
  totalNights = 86,
  totalCost = 7725,
  budget = 30000,
  destinations = [],
  totalPOI = 1210,
  favorites = [],
  onNavigate
}) {
  const departDate = new Date('2026-04-01');
  const today = new Date();
  const daysUntilTrip = Math.max(0, Math.ceil((departDate - today) / (1000 * 60 * 60 * 24)));
  const budgetPercent = Math.round((totalCost / budget) * 100);

  const styles = {
    container: {
      padding: '24px 32px',
      maxWidth: '1200px',
    },
    welcomeCard: {
      background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      borderRadius: '16px',
      padding: '32px',
      color: 'white',
      marginBottom: '24px',
    },
    welcomeTitle: {
      fontSize: '28px',
      fontWeight: 700,
      marginBottom: '8px',
    },
    welcomeSubtitle: {
      fontSize: '16px',
      opacity: 0.9,
      marginBottom: '24px',
    },
    countdownBadge: {
      display: 'inline-block',
      background: 'rgba(255,255,255,0.2)',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: 500,
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    },
    statCard: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
    },
    statValue: {
      fontSize: '32px',
      fontWeight: 700,
      color: '#111827',
      marginBottom: '4px',
    },
    statLabel: {
      fontSize: '13px',
      color: '#6B7280',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#111827',
      marginBottom: '16px',
    },
    budgetCard: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
    },
    budgetRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    progressBar: {
      background: '#f3f4f6',
      borderRadius: '6px',
      height: '8px',
      overflow: 'hidden',
      marginBottom: '8px',
    },
    progressFill: {
      height: '100%',
      borderRadius: '6px',
      background: '#14B8A6',
      width: `${Math.min(100, budgetPercent)}%`,
    },
    quickActions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
    },
    actionCard: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.15s',
      textAlign: 'left',
    },
    actionIcon: {
      fontSize: '24px',
      marginBottom: '12px',
    },
    actionTitle: {
      fontSize: '15px',
      fontWeight: 600,
      color: '#111827',
      marginBottom: '4px',
    },
    actionDesc: {
      fontSize: '13px',
      color: '#6B7280',
    },
  };

  return (
    <div style={styles.container}>
      {/* Welcome Card */}
      <div style={styles.welcomeCard}>
        <div style={styles.welcomeTitle}>Bienvenue sur 1Trip! 👋</div>
        <div style={styles.welcomeSubtitle}>
          {tripName} • {startDate} → {endDate}
        </div>
        <div style={styles.countdownBadge}>
          🗓️ Départ dans {daysUntilTrip} jours
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{totalNights}</div>
          <div style={styles.statLabel}>Nuits</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{destinations.length || 14}</div>
          <div style={styles.statLabel}>Destinations</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{totalPOI.toLocaleString()}</div>
          <div style={styles.statLabel}>Points d'intérêt</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>4</div>
          <div style={styles.statLabel}>Pays</div>
        </div>
      </div>

      {/* Budget Overview */}
      <h2 style={styles.sectionTitle}>Budget</h2>
      <div style={styles.budgetCard}>
        <div style={styles.budgetRow}>
          <div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Estimé</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>€{totalCost.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Budget</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>€{budget.toLocaleString()}</div>
          </div>
        </div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>
        <div style={{ fontSize: '13px', color: '#6B7280' }}>
          {budgetPercent}% utilisé • Reste €{(budget - totalCost).toLocaleString()}
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={styles.sectionTitle}>Accès rapide</h2>
      <div style={styles.quickActions}>
        <div
          style={styles.actionCard}
          onClick={() => onNavigate('explorer')}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#14B8A6'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(20,184,166,0.15)'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={styles.actionIcon}>🗺️</div>
          <div style={styles.actionTitle}>Explorer</div>
          <div style={styles.actionDesc}>Découvrir les {totalPOI.toLocaleString()} lieux</div>
        </div>
        <div
          style={styles.actionCard}
          onClick={() => onNavigate('planner')}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#14B8A6'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(20,184,166,0.15)'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={styles.actionIcon}>📋</div>
          <div style={styles.actionTitle}>Planner</div>
          <div style={styles.actionDesc}>Organiser l'itinéraire</div>
        </div>
        <div
          style={styles.actionCard}
          onClick={() => onNavigate('packing')}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#14B8A6'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(20,184,166,0.15)'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={styles.actionIcon}>🎒</div>
          <div style={styles.actionTitle}>Packing</div>
          <div style={styles.actionDesc}>Préparer les bagages</div>
        </div>
      </div>
    </div>
  );
}

export default SummaryView;
