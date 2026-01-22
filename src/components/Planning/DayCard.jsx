import { Icon, Button } from '../ui';

export default function DayCard({ day, items, onRemove }) {
  const formatDate = (dayNum) => {
    const start = new Date('2026-04-01');
    start.setDate(start.getDate() + dayNum - 1);
    return start.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>Jour {day}</span>
          <span style={{ marginLeft: '8px', fontSize: '13px', color: '#64748b' }}>
            {formatDate(day)}
          </span>
        </div>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{items.length} element(s)</span>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
          Aucune activite prevue
        </div>
      ) : (
        <div style={{ padding: '8px' }}>
          {items.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '6px',
                background: index % 2 === 0 ? '#f8fafc' : 'white',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon
                  name={item.type === 'restaurant' ? 'utensils' : item.type === 'hotel' ? 'bed' : 'pin'}
                  size={16}
                />
                <span style={{ fontWeight: 500, fontSize: '14px' }}>{item.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
                <Icon name="x" size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
