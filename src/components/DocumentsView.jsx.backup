import { useState } from 'react';

/**
 * DocumentsView - Gestion des documents style Stippl.io
 */

const DEFAULT_DOCUMENTS = [
  { id: 1, name: 'Passeport Youssef', type: 'passport', date: '2026-03-15', status: 'valid' },
  { id: 2, name: 'Passeport Épouse', type: 'passport', date: '2026-03-15', status: 'valid' },
  { id: 3, name: 'Passeport Enfant', type: 'passport', date: '2026-03-15', status: 'valid' },
  { id: 4, name: 'Assurance Voyage', type: 'insurance', date: '2026-04-01', status: 'pending' },
  { id: 5, name: 'Billets Paris → Manille', type: 'flight', date: '2026-04-01', status: 'confirmed' },
  { id: 6, name: 'Réservation El Nido Resort', type: 'hotel', date: '2026-04-02', status: 'confirmed' },
];

const DOCUMENT_TYPES = {
  passport: { icon: '🛂', label: 'Passeport', color: '#3B82F6' },
  flight: { icon: '✈️', label: 'Vol', color: '#8B5CF6' },
  hotel: { icon: '🏨', label: 'Hôtel', color: '#F59E0B' },
  insurance: { icon: '🛡️', label: 'Assurance', color: '#10B981' },
  visa: { icon: '📋', label: 'Visa', color: '#EC4899' },
  other: { icon: '📄', label: 'Autre', color: '#6B7280' },
};

const STATUS_STYLES = {
  valid: { bg: '#D1FAE5', color: '#065F46', label: 'Valide' },
  confirmed: { bg: '#DBEAFE', color: '#1E40AF', label: 'Confirmé' },
  pending: { bg: '#FEF3C7', color: '#92400E', label: 'En attente' },
  expired: { bg: '#FEE2E2', color: '#991B1B', label: 'Expiré' },
};

export function DocumentsView() {
  const [documents, setDocuments] = useState(DEFAULT_DOCUMENTS);
  const [filter, setFilter] = useState('all');

  const filteredDocs = filter === 'all' 
    ? documents 
    : documents.filter(d => d.type === filter);

  const styles = {
    container: {
      padding: '24px',
      maxWidth: '1200px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 600,
      color: '#111827',
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      background: '#14B8A6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
    },
    filters: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    filterBtn: (active) => ({
      padding: '8px 16px',
      background: active ? '#14B8A6' : '#ffffff',
      color: active ? 'white' : '#374151',
      border: '1px solid #e5e7eb',
      borderRadius: '20px',
      fontSize: '13px',
      cursor: 'pointer',
      transition: 'all 0.15s',
    }),
    documentsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '16px',
    },
    docCard: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      gap: '16px',
      cursor: 'pointer',
      transition: 'all 0.15s',
    },
    docIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      flexShrink: 0,
    },
    docInfo: {
      flex: 1,
    },
    docName: {
      fontSize: '15px',
      fontWeight: 500,
      color: '#111827',
      marginBottom: '4px',
    },
    docMeta: {
      fontSize: '13px',
      color: '#6B7280',
      marginBottom: '8px',
    },
    statusBadge: (status) => ({
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 500,
      background: STATUS_STYLES[status]?.bg || '#f3f4f6',
      color: STATUS_STYLES[status]?.color || '#374151',
    }),
    emptyState: {
      textAlign: 'center',
      padding: '48px',
      color: '#6B7280',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Documents</h1>
        <button style={styles.addButton}>
          <span>+</span> Ajouter un document
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <button
          style={styles.filterBtn(filter === 'all')}
          onClick={() => setFilter('all')}
        >
          Tous ({documents.length})
        </button>
        {Object.entries(DOCUMENT_TYPES).map(([type, info]) => {
          const count = documents.filter(d => d.type === type).length;
          if (count === 0) return null;
          return (
            <button
              key={type}
              style={styles.filterBtn(filter === type)}
              onClick={() => setFilter(type)}
            >
              {info.icon} {info.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      {filteredDocs.length > 0 ? (
        <div style={styles.documentsGrid}>
          {filteredDocs.map(doc => {
            const typeInfo = DOCUMENT_TYPES[doc.type] || DOCUMENT_TYPES.other;
            return (
              <div
                key={doc.id}
                style={styles.docCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#14B8A6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{ ...styles.docIcon, background: `${typeInfo.color}20` }}>
                  {typeInfo.icon}
                </div>
                <div style={styles.docInfo}>
                  <div style={styles.docName}>{doc.name}</div>
                  <div style={styles.docMeta}>
                    {typeInfo.label} • {new Date(doc.date).toLocaleDateString('fr-FR')}
                  </div>
                  <span style={styles.statusBadge(doc.status)}>
                    {STATUS_STYLES[doc.status]?.label || doc.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>Aucun document</div>
          <div style={{ fontSize: '14px' }}>Ajoutez vos documents de voyage ici</div>
        </div>
      )}
    </div>
  );
}

export default DocumentsView;
