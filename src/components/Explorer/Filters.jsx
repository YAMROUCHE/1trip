import { Button, Icon } from '../ui';

export default function Filters({
  typeFilter,
  setTypeFilter,
  familyFilter,
  setFamilyFilter,
  mustSeeFilter,
  setMustSeeFilter,
  search,
  setSearch,
}) {
  const types = [
    { id: 'all', label: 'Tout' },
    { id: 'activity', label: 'Activites' },
    { id: 'restaurant', label: 'Restaurants' },
    { id: 'hotel', label: 'Hotels' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px 10px 38px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            background: 'white',
          }}
        />
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
          <Icon name="search" size={16} />
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {types.map((t) => (
          <Button
            key={t.id}
            size="sm"
            active={typeFilter === t.id}
            onClick={() => setTypeFilter(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '6px' }}>
        <Button
          size="sm"
          active={familyFilter}
          onClick={() => setFamilyFilter(!familyFilter)}
          style={familyFilter ? { background: '#fef3c7', color: '#b45309' } : {}}
        >
          <Icon name="users" size={14} /> Familles
        </Button>
        <Button
          size="sm"
          active={mustSeeFilter}
          onClick={() => setMustSeeFilter(!mustSeeFilter)}
          style={mustSeeFilter ? { background: '#fef3c7', color: '#b45309' } : {}}
        >
          <Icon name="star" size={14} /> Incontournables
        </Button>
      </div>
    </div>
  );
}
