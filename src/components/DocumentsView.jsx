import React, { useState } from 'react';

const Icon = ({ name, size = 20, color = 'currentColor' }) => {
  const icons = {
    'file-text': (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>),
    plane: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>),
    bed: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 012 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /></svg>),
    shield: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),
    clipboard: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>),
    file: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>),
    folder: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>),
    plus: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>),
    check: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>),
    alert: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>),
    download: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>),
    trash: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>)
  };
  return icons[name] || null;
};

const DOC_TYPES = [
  { id: 'passeport', name: 'Passeport', icon: 'file-text', color: '#14B8A6' },
  { id: 'vol', name: 'Vol', icon: 'plane', color: '#6366F1' },
  { id: 'hotel', name: 'Hôtel', icon: 'bed', color: '#EC4899' },
  { id: 'assurance', name: 'Assurance', icon: 'shield', color: '#F59E0B' },
  { id: 'visa', name: 'Visa', icon: 'clipboard', color: '#10B981' },
  { id: 'autre', name: 'Autre', icon: 'file', color: '#6B7280' }
];

const DEFAULT_DOCUMENTS = [
  { id: 1, type: 'passeport', name: 'Passeport Youssef', details: 'Expire: 15/03/2030', status: 'valid' },
  { id: 2, type: 'passeport', name: 'Passeport Épouse', details: 'Expire: 22/08/2028', status: 'valid' },
  { id: 3, type: 'passeport', name: 'Passeport Enfant', details: 'Expire: 10/01/2029', status: 'valid' },
  { id: 4, type: 'vol', name: 'Vol Paris → Manille', details: '1er avril 2026 · Air France', status: 'pending' },
  { id: 5, type: 'vol', name: 'Vol Bali → Paris', details: '26 juin 2026 · Singapore Airlines', status: 'pending' },
  { id: 6, type: 'assurance', name: 'Assurance Voyage', details: 'Chapka · 86 jours · Famille', status: 'pending' },
  { id: 7, type: 'hotel', name: 'One El Nido Suite', details: '1-6 avril · 6 nuits', status: 'valid' }
];

export const DocumentsView = () => {
  const [documents, setDocuments] = useState(DEFAULT_DOCUMENTS);
  const [selectedType, setSelectedType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ type: 'passeport', name: '', details: '' });

  const filteredDocs = selectedType === 'all' ? documents : documents.filter(d => d.type === selectedType);
  const getDocType = (typeId) => DOC_TYPES.find(t => t.id === typeId) || DOC_TYPES[5];
  const validCount = documents.filter(d => d.status === 'valid').length;
  const pendingCount = documents.filter(d => d.status === 'pending').length;

  const addDocument = () => {
    if (!newDoc.name.trim()) return;
    setDocuments(prev => [...prev, { id: Date.now(), ...newDoc, status: 'pending' }]);
    setNewDoc({ type: 'passeport', name: '', details: '' });
    setShowAddModal(false);
  };

  const deleteDocument = (id) => setDocuments(prev => prev.filter(d => d.id !== id));
  const toggleStatus = (id) => setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'valid' ? 'pending' : 'valid' } : d));

  const styles = {
    container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
    title: { fontSize: '24px', fontWeight: '600', color: '#111827', margin: 0 },
    subtitle: { fontSize: '14px', color: '#6B7280', margin: 0 },
    addButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#14B8A6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    filters: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
    filterBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#6B7280' },
    filterBtnActive: { borderColor: '#14B8A6', background: '#F0FDFA', color: '#14B8A6' },
    docList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    docCard: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px' },
    docIcon: { width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    docInfo: { flex: 1 },
    docName: { fontSize: '15px', fontWeight: '500', color: '#111827', margin: '0 0 4px 0' },
    docDetails: { fontSize: '13px', color: '#6B7280', margin: 0 },
    docActions: { display: 'flex', alignItems: 'center', gap: '8px' },
    statusBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500' },
    statusValid: { background: '#D1FAE5', color: '#10B981' },
    statusPending: { background: '#FEF3C7', color: '#F59E0B' },
    actionBtn: { padding: '8px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { background: '#fff', borderRadius: '16px', padding: '24px', width: '400px', maxWidth: '90vw' },
    modalTitle: { fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 20px 0' },
    formGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
    select: { width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#fff' },
    modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
    cancelBtn: { padding: '10px 20px', background: '#F3F4F6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#6B7280' },
    submitBtn: { padding: '10px 20px', background: '#14B8A6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#fff', fontWeight: '500' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Icon name="folder" size={28} color="#14B8A6" />
          <div>
            <h1 style={styles.title}>Documents</h1>
            <p style={styles.subtitle}><span style={{ color: '#10B981' }}>{validCount} prêts</span> · <span style={{ color: '#F59E0B' }}>{pendingCount} en attente</span></p>
          </div>
        </div>
        <button style={styles.addButton} onClick={() => setShowAddModal(true)}><Icon name="plus" size={20} color="#fff" /><span>Ajouter</span></button>
      </div>
      <div style={styles.filters}>
        <button style={{ ...styles.filterBtn, ...(selectedType === 'all' ? styles.filterBtnActive : {}) }} onClick={() => setSelectedType('all')}>Tous ({documents.length})</button>
        {DOC_TYPES.map(type => {
          const count = documents.filter(d => d.type === type.id).length;
          if (count === 0) return null;
          return (<button key={type.id} style={{ ...styles.filterBtn, ...(selectedType === type.id ? styles.filterBtnActive : {}) }} onClick={() => setSelectedType(type.id)}><Icon name={type.icon} size={16} color={selectedType === type.id ? '#14B8A6' : '#6B7280'} /><span>{type.name} ({count})</span></button>);
        })}
      </div>
      <div style={styles.docList}>
        {filteredDocs.map(doc => {
          const docType = getDocType(doc.type);
          return (
            <div key={doc.id} style={styles.docCard}>
              <div style={{ ...styles.docIcon, background: `${docType.color}15` }}><Icon name={docType.icon} size={24} color={docType.color} /></div>
              <div style={styles.docInfo}><h3 style={styles.docName}>{doc.name}</h3><p style={styles.docDetails}>{doc.details}</p></div>
              <div style={styles.docActions}>
                <button style={{ ...styles.statusBtn, ...(doc.status === 'valid' ? styles.statusValid : styles.statusPending) }} onClick={() => toggleStatus(doc.id)}>
                  {doc.status === 'valid' ? (<><Icon name="check" size={14} color="#10B981" /><span>Prêt</span></>) : (<><Icon name="alert" size={14} color="#F59E0B" /><span>En attente</span></>)}
                </button>
                <button style={styles.actionBtn} onClick={() => deleteDocument(doc.id)}><Icon name="trash" size={18} color="#6B7280" /></button>
              </div>
            </div>
          );
        })}
      </div>
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Ajouter un document</h2>
            <div style={styles.formGroup}><label style={styles.label}>Type</label><select value={newDoc.type} onChange={e => setNewDoc(prev => ({ ...prev, type: e.target.value }))} style={styles.select}>{DOC_TYPES.map(type => (<option key={type.id} value={type.id}>{type.name}</option>))}</select></div>
            <div style={styles.formGroup}><label style={styles.label}>Nom</label><input type="text" value={newDoc.name} onChange={e => setNewDoc(prev => ({ ...prev, name: e.target.value }))} placeholder="Ex: Passeport Youssef" style={styles.input} /></div>
            <div style={styles.formGroup}><label style={styles.label}>Détails</label><input type="text" value={newDoc.details} onChange={e => setNewDoc(prev => ({ ...prev, details: e.target.value }))} placeholder="Ex: Expire le 15/03/2030" style={styles.input} /></div>
            <div style={styles.modalActions}><button style={styles.cancelBtn} onClick={() => setShowAddModal(false)}>Annuler</button><button style={styles.submitBtn} onClick={addDocument}>Ajouter</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsView;
