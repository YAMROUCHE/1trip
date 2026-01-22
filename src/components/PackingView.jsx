import React, { useState } from 'react';

const Icon = ({ name, size = 20, color = 'currentColor' }) => {
  const icons = {
    star: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>),
    shirt: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" /></svg>),
    droplet: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>),
    laptop: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="2" y1="20" x2="22" y2="20" /></svg>),
    smile: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>),
    check: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>),
    plus: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>),
    trash: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>),
    luggage: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="14" rx="2" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /><line x1="9" y1="20" x2="9" y2="22" /><line x1="15" y1="20" x2="15" y2="22" /></svg>)
  };
  return icons[name] || null;
};

const CATEGORIES = [
  { id: 'essentiels', name: 'Essentiels', icon: 'star', color: '#14B8A6' },
  { id: 'vetements', name: 'Vêtements', icon: 'shirt', color: '#6366F1' },
  { id: 'toilette', name: 'Toilette', icon: 'droplet', color: '#EC4899' },
  { id: 'tech', name: 'Tech', icon: 'laptop', color: '#F59E0B' },
  { id: 'enfant', name: 'Enfant', icon: 'smile', color: '#10B981' }
];

const DEFAULT_ITEMS = {
  essentiels: [
    { id: 1, name: 'Passeports', checked: false },
    { id: 2, name: 'Billets avion', checked: false },
    { id: 3, name: 'Cartes bancaires', checked: false },
    { id: 4, name: 'Assurance voyage', checked: false },
    { id: 5, name: 'Permis international', checked: false }
  ],
  vetements: [
    { id: 6, name: 'T-shirts (x7)', checked: false },
    { id: 7, name: 'Shorts (x4)', checked: false },
    { id: 8, name: 'Pantalon léger', checked: false },
    { id: 9, name: 'Maillot de bain (x2)', checked: false },
    { id: 10, name: 'Chaussures rando', checked: false },
    { id: 11, name: 'Sandales', checked: false },
    { id: 12, name: 'Chapeau/casquette', checked: false }
  ],
  toilette: [
    { id: 13, name: 'Crème solaire 50+', checked: false },
    { id: 14, name: 'Anti-moustiques', checked: false },
    { id: 15, name: 'Trousse de toilette', checked: false },
    { id: 16, name: 'Médicaments', checked: false },
    { id: 17, name: 'Serviette microfibre', checked: false }
  ],
  tech: [
    { id: 18, name: 'Téléphones + chargeurs', checked: false },
    { id: 19, name: 'Adaptateur universel', checked: false },
    { id: 20, name: 'Batterie externe', checked: false },
    { id: 21, name: 'Appareil photo', checked: false },
    { id: 22, name: 'Écouteurs', checked: false }
  ],
  enfant: [
    { id: 23, name: 'Jouets voyage', checked: false },
    { id: 24, name: 'Tablette + casque', checked: false },
    { id: 25, name: 'Doudou', checked: false },
    { id: 26, name: 'Gourde enfant', checked: false },
    { id: 27, name: 'Livres/coloriages', checked: false }
  ]
};

export const PackingView = () => {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('essentiels');

  const toggleItem = (categoryId, itemId) => {
    setItems(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const addItem = (categoryId) => {
    if (!newItem.trim()) return;
    setItems(prev => ({
      ...prev,
      [categoryId]: [...prev[categoryId], { id: Date.now(), name: newItem, checked: false }]
    }));
    setNewItem('');
  };

  const deleteItem = (categoryId, itemId) => {
    setItems(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(item => item.id !== itemId)
    }));
  };

  const totalItems = Object.values(items).flat().length;
  const checkedItems = Object.values(items).flat().filter(i => i.checked).length;
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const styles = {
    container: { padding: '24px', maxWidth: '800px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
    title: { fontSize: '24px', fontWeight: '600', color: '#111827', margin: 0 },
    subtitle: { fontSize: '14px', color: '#6B7280', margin: 0 },
    progressBar: { height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' },
    progressFill: { height: '100%', background: 'linear-gradient(90deg, #14B8A6, #10B981)', borderRadius: '4px', transition: 'width 0.3s ease' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
    tab: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '14px', color: '#6B7280' },
    tabActive: { borderColor: '#14B8A6', background: '#F0FDFA', color: '#14B8A6' },
    badge: { fontSize: '12px', padding: '2px 6px', background: '#F3F4F6', borderRadius: '10px' },
    content: { background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px' },
    itemsList: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
    item: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '8px' },
    checkbox: { width: '24px', height: '24px', borderRadius: '6px', border: '2px solid #D1D5DB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    checkboxChecked: { background: '#14B8A6', borderColor: '#14B8A6' },
    itemName: { flex: 1, fontSize: '14px', color: '#374151' },
    itemNameChecked: { textDecoration: 'line-through', color: '#9CA3AF' },
    deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', opacity: 0.5 },
    addItem: { display: 'flex', gap: '8px' },
    input: { flex: 1, padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none' },
    addBtn: { padding: '12px 16px', background: '#14B8A6', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Icon name="luggage" size={28} color="#14B8A6" />
          <div>
            <h1 style={styles.title}>Packing List</h1>
            <p style={styles.subtitle}>{checkedItems}/{totalItems} items · {progress}% prêt</p>
          </div>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
      </div>
      <div style={styles.tabs}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} style={{ ...styles.tab, ...(selectedCategory === cat.id ? styles.tabActive : {}) }} onClick={() => setSelectedCategory(cat.id)}>
            <Icon name={cat.icon} size={18} color={selectedCategory === cat.id ? '#14B8A6' : '#6B7280'} />
            <span>{cat.name}</span>
            <span style={styles.badge}>{items[cat.id].filter(i => i.checked).length}/{items[cat.id].length}</span>
          </button>
        ))}
      </div>
      <div style={styles.content}>
        <div style={styles.itemsList}>
          {items[selectedCategory].map(item => (
            <div key={item.id} style={styles.item}>
              <button style={{ ...styles.checkbox, ...(item.checked ? styles.checkboxChecked : {}) }} onClick={() => toggleItem(selectedCategory, item.id)}>
                {item.checked && <Icon name="check" size={14} color="#fff" />}
              </button>
              <span style={{ ...styles.itemName, ...(item.checked ? styles.itemNameChecked : {}) }}>{item.name}</span>
              <button style={styles.deleteBtn} onClick={() => deleteItem(selectedCategory, item.id)}>
                <Icon name="trash" size={16} color="#9CA3AF" />
              </button>
            </div>
          ))}
        </div>
        <div style={styles.addItem}>
          <input type="text" placeholder="Ajouter un item..." value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addItem(selectedCategory)} style={styles.input} />
          <button style={styles.addBtn} onClick={() => addItem(selectedCategory)}>
            <Icon name="plus" size={20} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackingView;
