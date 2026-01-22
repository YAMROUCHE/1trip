export default function Button({ 
  children, 
  variant = 'default', 
  size = 'md', 
  active = false,
  onClick,
  style = {},
}) {
  const variants = {
    default: {
      background: active ? '#e0e7ff' : '#f1f5f9',
      color: active ? '#4338ca' : '#64748b',
    },
    primary: {
      background: '#6366f1',
      color: 'white',
    },
    ghost: {
      background: 'transparent',
      color: '#64748b',
    },
    danger: {
      background: '#fef2f2',
      color: '#dc2626',
    },
  };

  const sizes = {
    sm: { padding: '6px 10px', fontSize: '12px' },
    md: { padding: '8px 14px', fontSize: '13px' },
    lg: { padding: '10px 18px', fontSize: '14px' },
  };

  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
