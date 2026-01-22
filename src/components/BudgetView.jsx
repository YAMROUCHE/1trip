import { useState } from 'react';

/**
 * BudgetView - Suivi du budget style Stippl.io
 */

const BUDGET_CATEGORIES = [
  { id: 'transport', label: 'Transport', icon: '✈️', color: '#3B82F6' },
  { id: 'hebergement', label: 'Hébergement', icon: '🏨', color: '#8B5CF6' },
  { id: 'restauration', label: 'Restauration', icon: '🍽️', color: '#F59E0B' },
  { id: 'activites', label: 'Activités', icon: '🎭', color: '#10B981' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#EC4899' },
  { id: 'autres', label: 'Autres', icon: '📦', color: '#6B7280' },
];

export function BudgetView({ budget = 30000, expenses = [], destinations = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Calcul des dépenses par catégorie depuis les destinations
  const categoryTotals = BUDGET_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = 0;
    return acc;
  }, {});

  // Calculer depuis les destinations
  let totalSpent = 0;
  destinations.forEach(dest => {
    if (dest.cost) {
      totalSpent += dest.cost;
      categoryTotals['hebergement'] += dest.cost * 0.5; // Estimation
      categoryTotals['restauration'] += dest.cost * 0.3;
      categoryTotals['activites'] += dest.cost * 0.2;
    }
  });

  const remaining = budget - totalSpent;
  const percentUsed = Math.round((totalSpent / budget) * 100);

  const styles = {
    container: {
      padding: '24px',
      maxWidth: '1200px',
    },
    header: {
      marginBottom: '24px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 600,
      color: '#111827',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#6B7280',
    },
    overviewCard: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
    },
    budgetRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: '16px',
    },
    bigNumber: {
      fontSize: '36px',
      fontWeight: 700,
      color: '#111827',
    },
    label: {
      fontSize: '13px',
      color: '#6B7280',
      marginBottom: '4px',
    },
    progressBar: {
      background: '#f3f4f6',
      borderRadius: '8px',
      height: '12px',
      overflow: 'hidden',
      marginBottom: '8px',
    },
    progressFill: {
      height: '100%',
      borderRadius: '8px',
      background: percentUsed > 80 ? '#EF4444' : '#14B8A6',
      width: `${Math.min(100, percentUsed)}%`,
      transition: 'width 0.3s ease',
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    },
    categoryCard: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.15s',
    },
    categoryIcon: {
      fontSize: '24px',
      marginBottom: '8px',
    },
    categoryName: {
      fontSize: '14px',
      fontWeight: 500,
      color: '#374151',
      marginBottom: '4px',
    },
    categoryAmount: {
      fontSize: '20px',
      fontWeight: 600,
      color: '#111827',
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      background: '#14B8A6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Budget</h1>
        <p style={styles.subtitle}>Gérez vos dépenses pour le voyage</p>
      </div>

      {/* Overview Card */}
      <div style={styles.overviewCard}>
        <div style={styles.budgetRow}>
          <div>
            <div style={styles.label}>Dépensé</div>
            <div style={styles.bigNumber}>€{totalSpent.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={styles.label}>Restant</div>
            <div style={{ ...styles.bigNumber, color: remaining >= 0 ? '#10B981' : '#EF4444' }}>
              €{remaining.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={styles.label}>Budget total</div>
            <div style={styles.bigNumber}>€{budget.toLocaleString()}</div>
          </div>
        </div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>
        <div style={{ fontSize: '13px', color: '#6B7280' }}>
          {percentUsed}% du budget utilisé
        </div>
      </div>

      {/* Categories Grid */}
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#374151' }}>
        Par catégorie
      </h2>
      <div style={styles.categoriesGrid}>
        {BUDGET_CATEGORIES.map(cat => (
          <div
            key={cat.id}
            style={{
              ...styles.categoryCard,
              borderLeft: `4px solid ${cat.color}`,
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={styles.categoryIcon}>{cat.icon}</div>
            <div style={styles.categoryName}>{cat.label}</div>
            <div style={styles.categoryAmount}>€{Math.round(categoryTotals[cat.id]).toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Add Expense Button */}
      <button style={styles.addButton}>
        <span>+</span> Ajouter une dépense
      </button>
    </div>
  );
}

export default BudgetView;
