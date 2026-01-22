import { TYPE_COLORS } from '../../styles/colors';

export default function Badge({ type, children, size = 'md' }) {
  const colors = TYPE_COLORS[type] || { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' };
  const sizes = {
    sm: { padding: '2px 6px', fontSize: '11px' },
    md: { padding: '4px 10px', fontSize: '12px' },
    lg: { padding: '6px 12px', fontSize: '13px' },
  };
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      borderRadius: '6px',
      fontWeight: 500,
      ...sizes[size],
    }}>
      {children}
    </span>
  );
}
