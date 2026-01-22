import { useState } from 'react';

/**
 * PackingView - Liste de bagages style Stippl.io
 */

const DEFAULT_PACKING_LISTS = {
  essentiels: {
    name: 'Essentiels',
    icon: '⭐',
    items: [
      { id: 1, name: 'Passeport', checked: false },
      { id: 2, name: 'Billets d\'avion', checked: false },
      { id: 3, name: 'Assurance voyage', checked: false },
      { id: 4, name: 'Carte bancaire', checked: false },
      { id: 5, name: 'Téléphone + chargeur', checked: false },
      { id: 6, name: 'Adaptateur prise', checked: false },
    ]
  },
  vetements: {
    name: 'Vêtements',
    icon: '👕',
    items: [
      { id: 7, name: 'T-shirts (x7)', checked: false },
      { id: 8, name: 'Pantalons/shorts (x4)', checked: false },
      { id: 9, name: 'Sous-vêtements (x7)', checked: false },
      { id: 10, name: 'Maillot de bain', checked: false },
      { id: 11, name: 'Chaussures de marche', checked: false },
      { id: 12, name: 'Sandales', checked: false },
      { id: 13, name: 'Veste légère', checked: false },
    ]
  },
  toilette: {
    name: 'Toilette',
    icon: '🧴',
    items: [
      { id: 14, name: 'Brosse à dents', checked: false },
      { id: 15, name: 'Dentifrice', checked: false },
      { id: 16, name: 'Shampoing', checked: false },
      { id: 17, name: 'Crème solaire', checked: false },
      { id: 18, name: 'Anti-moustique', checked: false },
      { id: 19, name: 'Médicaments', checked: false },
    ]
  },
  tech: {
    name: 'Tech & Électronique',
    icon: '💻',
    items: [
      { id: 20, name: 'Appareil photo', checked: false },
      { id: 21, name: 'Batterie externe', checked: false },
      { id: 22, name: 'Écouteurs', checked: false },
      { id: 23, name: 'Kindle/Tablette', checked: false },
    ]
  },
  enfant: {
    name: 'Pour l\'enfant',
    icon: '👶',
    items: [
      { id: 24, name: 'Jouets voyage', checked: false },
      { id: 25, name: 'Livres/Coloriages', checked: false },
      { id: 26, name: 'Goûters', checked: false },
      { id: 27, name: 'Doudou', checked: false },
      { id: 28, name: 'Casque audio enfant', checked: false },
    ]
  },
};

export function PackingView() {
  const [packingLists, setPackingLists] = useState(DEFAULT_PACKING_LISTS);
  const [newItem, setNewItem] = useState('');
  const [selectedList, setSelectedList] = useState('essentiels');

  const toggleItem = (listId, itemId) => {
    setPackingLists(prev => ({
      ...prev,
      [listId]: {
        ...prev[listId],
        items: prev[listId].items.map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      }
    }));
  };

  const addItem = (listId) => {
    if (!newItem.trim()) return;
    setPackingLists(prev => ({
      ...prev,
      [listId]: {
        ...prev[listId],
        items: [...prev[listId].items, { id: Date.now(), name: newItem, checked: false }]
      }
    }));
    setNewItem('');
  };

  const getTotalProgress = () => {
    let total = 0;
    let checked = 0;
    Object.values(packingLists).forEach(list => {
      total += list.items.length;
      checked += list.items.filter(i => i.checked).length;
    });
    return { total, checked, percent: total > 0 ? Math.round((checked / total) * 100) : 0 };
  };

  const progress = getTotalProgress();

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
    progressCard: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
    },
    progressBar: {
      background: '#f3f4f6',
      borderRadius: '8px',
      height: '10px',
      overflow: 'hidden',
      marginBottom: '8px',
    },
    progressFill: {
      height: '100%',
      borderRadius: '8px',
      background: '#14B8A6',
      width: `${progress.percent}%`,
      transition: 'width 0.3s ease',
    },
    listsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px',
    },
    listCard: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    listHeader: {
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    listIcon: {
      fontSize: '20px',
    },
    listName: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#111827',
    },
    listCount: {
      marginLeft: 'auto',
      fontSize: '13px',
      color: '#6B7280',
    },
    itemsList: {
      padding: '8px 0',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 16px',
      cursor: 'pointer',
      transition: 'background 0.1s',
    },
    checkbox: {
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      border: '2px solid #d1d5db',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    checkboxChecked: {
      background: '#14B8A6',
      borderColor: '#14B8A6',
      color: 'white',
    },
    itemName: {
      fontSize: '14px',
      color: '#374151',
    },
    itemNameChecked: {
      textDecoration: 'line-through',
      color: '#9CA3AF',
    },
    addInput: {
      display: 'flex',
      padding: '12px 16px',
      borderTop: '1px solid #e5e7eb',
      gap: '8px',
    },
    input: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      fontSize: '14px',
    },
    addBtn: {
      padding: '8px 16px',
      background: '#14B8A6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Packing List</h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>Préparez vos bagages pour le voyage</p>
      </div>

      {/* Progress Card */}
      <div style={styles.progressCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', color: '#374151' }}>Progression</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#14B8A6' }}>
            {progress.checked}/{progress.total} ({progress.percent}%)
          </span>
        </div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>
      </div>

      {/* Lists Grid */}
      <div style={styles.listsGrid}>
        {Object.entries(packingLists).map(([listId, list]) => {
          const listChecked = list.items.filter(i => i.checked).length;
          return (
            <div key={listId} style={styles.listCard}>
              <div style={styles.listHeader}>
                <span style={styles.listIcon}>{list.icon}</span>
                <span style={styles.listName}>{list.name}</span>
                <span style={styles.listCount}>{listChecked}/{list.items.length}</span>
              </div>
              <div style={styles.itemsList}>
                {list.items.map(item => (
                  <div
                    key={item.id}
                    style={styles.item}
                    onClick={() => toggleItem(listId, item.id)}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      ...styles.checkbox,
                      ...(item.checked ? styles.checkboxChecked : {})
                    }}>
                      {item.checked && '✓'}
                    </div>
                    <span style={{
                      ...styles.itemName,
                      ...(item.checked ? styles.itemNameChecked : {})
                    }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
              <div style={styles.addInput}>
                <input
                  type="text"
                  placeholder="Ajouter un item..."
                  style={styles.input}
                  value={selectedList === listId ? newItem : ''}
                  onFocus={() => setSelectedList(listId)}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem(listId)}
                />
                <button style={styles.addBtn} onClick={() => addItem(listId)}>+</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PackingView;
