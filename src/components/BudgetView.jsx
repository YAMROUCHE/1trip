import { useState, useMemo } from 'react';

const COLORS = {
  'Arabie Saoudite': '#059669', 'Maldives': '#0891b2', 'Singapour': '#be185d',
  'Philippines': '#2563eb', 'Cambodge': '#7c3aed', 'Vietnam': '#ca8a04',
  'Thaïlande': '#dc2626', 'Indonésie': '#16a34a',
};
const CODES = {
  'Arabie Saoudite': 'SA', 'Maldives': 'MV', 'Singapour': 'SG',
  'Philippines': 'PH', 'Cambodge': 'KH', 'Vietnam': 'VN',
  'Thaïlande': 'TH', 'Indonésie': 'ID',
};
const col = c => COLORS[c] || '#6b7280';

const Ic = ({ d, s = 14, c = 'currentColor' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d={d} /></svg>;
const Card = ({ children, style }) => (
  <div style={{ background: '#fff', borderRadius: 10, padding: 16, border: '1px solid #e5e7eb', marginBottom: 10, ...style }}>{children}</div>
);
const Sec = ({ label, children }) => (
  <><div style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>{label}</div>{children}</>
);
const Badge = ({ country }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 26, height: 26, borderRadius: 6, fontSize: 10, fontWeight: 700,
    background: `${col(country)}14`, color: col(country), flexShrink: 0,
  }}>{CODES[country] || '??'}</span>
);

const CATEGORIES = [
  { id: 'hotels', label: 'Hébergement', icon: 'M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm12-7h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z', color: '#10b981', fromDb: true },
  { id: 'vols', label: 'Vols internationaux', icon: 'M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z', color: '#2563eb', default: 6380 },
  { id: 'food', label: 'Nourriture', icon: 'M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z', color: '#f97316', default: 9500 },
  { id: 'assurance', label: 'Assurance', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z', color: '#7c3aed', default: 450 },
  { id: 'divers', label: 'Activités et divers', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', color: '#ec4899', default: 800 },
];

export default function BudgetView({ days, stats, loading, error }) {
  const ov = stats?.overview || {};
  const bc = stats?.by_country || [];
  const hotelBudget = ov.total_budget_hotels || 0;
  const totalDays = ov.total_days || 104;

  const [cats, setCats] = useState(() => CATEGORIES.map(c => ({ ...c, amount: c.fromDb ? 0 : c.default })));
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState('');

  const merged = useMemo(() => cats.map(c => c.fromDb ? { ...c, amount: hotelBudget } : c), [cats, hotelBudget]);
  const total = merged.reduce((s, c) => s + c.amount, 0);

  const startEdit = id => { const c = merged.find(x => x.id === id); if (c && !c.fromDb) { setEditing(id); setEditVal(String(c.amount)); } };
  const saveEdit = () => { if (editing) { setCats(p => p.map(c => c.id === editing ? { ...c, amount: parseInt(editVal) || 0 } : c)); setEditing(null); } };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid #e5e7eb', borderTopColor: '#10b981', borderRadius: '50%', animation: 'sp .7s linear infinite' }} />
      <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return <div style={{ padding: '60px 20px', textAlign: 'center', fontSize: 13, color: '#dc2626' }}>{error}</div>;

  return (
    <div style={{ paddingTop: 20 }}>

      {/* TOTAL */}
      <Card style={{ textAlign: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '24px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#059669', textTransform: 'uppercase', letterSpacing: 2 }}>Budget total estimé</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: '#10b981', margin: '4px 0' }}>{total.toLocaleString('fr-FR')}€</div>
        <div style={{ fontSize: 11, color: '#666' }}>~{Math.round(total / totalDays)}€/jour · {totalDays} jours · 3 voyageurs</div>
      </Card>

      {/* CATÉGORIES */}
      <Card>
        <Sec label="Par catégorie">
          {merged.map(cat => {
            const pct = total > 0 ? ((cat.amount / total) * 100).toFixed(0) : 0;
            const isEd = editing === cat.id;
            return (
              <div key={cat.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: `${cat.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Ic d={cat.icon} s={13} c={cat.color} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 450 }}>{cat.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isEd ? (
                      <>
                        <input type="number" value={editVal} onChange={e => setEditVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEdit()}
                          style={{ width: 80, padding: '3px 8px', borderRadius: 5, border: `2px solid ${cat.color}`, fontSize: 13, fontWeight: 600, textAlign: 'right', outline: 'none', fontFamily: 'inherit' }} autoFocus />
                        <button onClick={saveEdit} style={{ width: 24, height: 24, borderRadius: 5, border: 'none', background: cat.color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Ic d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" s={13} c="#fff" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{cat.amount.toLocaleString('fr-FR')}€</span>
                        <span style={{ fontSize: 10, color: '#999' }}>({pct}%)</span>
                        {!cat.fromDb && (
                          <button onClick={() => startEdit(cat.id)} style={{ width: 20, height: 20, borderRadius: 4, border: 'none', background: '#f5f5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Ic d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" s={10} c="#bbb" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div style={{ height: 5, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>{total.toLocaleString('fr-FR')}€</span>
          </div>
        </Sec>
      </Card>

      {/* PAR PAYS */}
      <Card>
        <Sec label="Hébergement par pays">
          {bc.map(c => {
            const pct = hotelBudget > 0 ? ((c.budget / hotelBudget) * 100).toFixed(0) : 0;
            const avg = c.days > 0 ? Math.round(c.budget / c.days) : 0;
            return (
              <div key={c.country} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge country={c.country} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{c.country}</div>
                      <div style={{ fontSize: 10, color: '#999' }}>{c.days} nuits · ~{avg}€/nuit</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{(c.budget || 0).toLocaleString('fr-FR')}€</div>
                    <div style={{ fontSize: 10, color: '#999' }}>{pct}%</div>
                  </div>
                </div>
                <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: col(c.country), borderRadius: 2, transition: 'width 0.3s' }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#666' }}>Total hébergement</div>
              <div style={{ fontSize: 10, color: '#999' }}>~{totalDays > 0 ? Math.round(hotelBudget / totalDays) : 0}€/nuit</div>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#10b981' }}>{hotelBudget.toLocaleString('fr-FR')}€</span>
          </div>
        </Sec>
      </Card>

      {/* STATS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 30 }}>
        {[
          { label: 'Nuit max', value: days.length > 0 ? Math.max(...days.map(d => d.hotel_price || 0)) : 0, suffix: '€' },
          { label: 'Nuit min', value: days.length > 0 ? Math.min(...days.filter(d => d.hotel_price > 0).map(d => d.hotel_price)) || 0 : 0, suffix: '€' },
          { label: 'Nuits à 0€', value: days.filter(d => !d.hotel_price).length, suffix: '' },
        ].map((s, i) => (
          <Card key={i} style={{ flex: 1, textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{s.value}{s.suffix}</div>
            <div style={{ fontSize: 9, color: '#999', marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
