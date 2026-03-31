import { useMemo } from 'react';

const START = new Date(2026, 2, 24);
const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

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
const code = c => CODES[c] || '??';

const dateFR = d => `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;

const Ic = ({ d, s = 16, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d={d} /></svg>
);
const P = {
  pin: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  cal: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z',
  hotel: 'M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm12-7h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z',
  plane: 'M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  bus: 'M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z',
  arrow: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
};

const Card = ({ children, style }) => (
  <div style={{ background: '#fff', borderRadius: 10, padding: 16, border: '1px solid #e5e7eb', marginBottom: 10, ...style }}>
    {children}
  </div>
);

const Sec = ({ label, children }) => (
  <>
    <div style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>{label}</div>
    {children}
  </>
);

const Badge = ({ country }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 26, height: 26, borderRadius: 6, fontSize: 10, fontWeight: 700,
    background: `${col(country)}12`, color: col(country), flexShrink: 0,
  }}>{code(country)}</span>
);

const MiniDay = ({ day }) => {
  const transit = day.is_transition === 1;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
      borderRadius: 8, background: transit ? '#fafaf5' : '#fafafa', marginBottom: 3,
      border: transit ? '1px solid #e5e7d0' : '1px solid transparent',
    }}>
      <div style={{ width: 32, textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: col(day.country) }}>J{day.day_number}</div>
      </div>
      <Badge country={day.country} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {day.destination}
        </div>
        {transit && day.transport_notes && (
          <div style={{ fontSize: 10, color: '#999', marginTop: 1 }}>{day.transport_notes}</div>
        )}
      </div>
      {day.hotel_price > 0 && (
        <span style={{ fontSize: 11, fontWeight: 600, color: '#666', flexShrink: 0 }}>{day.hotel_price}€</span>
      )}
    </div>
  );
};

function getPhase(days) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const s = new Date(START); s.setHours(0, 0, 0, 0);
  const diff = Math.floor((now - s) / 86400000);
  if (diff < 0) {
    return { phase: 'before', daysUntil: Math.abs(diff), upcoming: days.slice(0, 10) };
  }
  const dn = diff + 1;
  if (dn > (days.length || 104)) return { phase: 'after' };
  const today = days.find(d => d.day_number === dn);
  const tomorrow = days.find(d => d.day_number === dn + 1);
  const upcoming = days.filter(d => d.day_number > dn && d.day_number <= dn + 6);
  const spent = days.filter(d => d.day_number <= dn).reduce((s, d) => s + (d.hotel_price || 0), 0);
  return { phase: 'during', dayNumber: dn, today, tomorrow, upcoming, spent };
}

// ===== AVANT =====
function Before({ daysUntil, days, stats }) {
  const bc = stats?.by_country || [];
  const ov = stats?.overview || {};

  return (
    <div style={{ paddingTop: 20 }}>
      {/* Countdown */}
      <Card style={{ textAlign: 'center', padding: '32px 20px', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#059669', textTransform: 'uppercase', letterSpacing: 2 }}>Départ dans</div>
        <div style={{ fontSize: 56, fontWeight: 800, color: '#10b981', lineHeight: 1, margin: '6px 0' }}>{daysUntil}</div>
        <div style={{ fontSize: 14, color: '#059669', marginBottom: 12 }}>jours</div>
        <div style={{ fontSize: 12, color: '#666', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Ic d={P.cal} s={13} c="#999" /> {dateFR(START)} 2026
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {[
          { v: ov.total_days || 104, l: 'jours' },
          { v: bc.length || 8, l: 'pays' },
          { v: 3, l: 'voyageurs' },
        ].map((s, i) => (
          <Card key={i} style={{ flex: 1, textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>{s.v}</div>
            <div style={{ fontSize: 10, color: '#999' }}>{s.l}</div>
          </Card>
        ))}
      </div>

      {/* Parcours */}
      <Card>
        <Sec label="Parcours">
          <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 2, marginBottom: 14 }}>
            {bc.map(c => <div key={c.country} style={{ flex: c.days, background: col(c.country), borderRadius: 2 }} />)}
          </div>
          {bc.map(c => (
            <div key={c.country} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Badge country={c.country} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{c.country}</span>
                  <span style={{ fontSize: 11, color: '#666' }}>{c.days}j · {(c.budget || 0).toLocaleString('fr-FR')}€</span>
                </div>
                <div style={{ height: 3, background: '#f3f4f6', borderRadius: 2, marginTop: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${((c.days / (ov.total_days || 104)) * 100)}%`, background: col(c.country), borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </Sec>
      </Card>

      {/* Budget */}
      <Card style={{ textAlign: 'center' }}>
        <Sec label="Budget hébergement">
          <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>{(ov.total_budget_hotels || 0).toLocaleString('fr-FR')}€</div>
          <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
            ~{ov.total_days ? Math.round((ov.total_budget_hotels || 0) / ov.total_days) : 0}€ / nuit
          </div>
        </Sec>
      </Card>

      {/* Premiers jours */}
      <Card>
        <Sec label="Premiers jours">
          {days.slice(0, 8).map(d => <MiniDay key={d.day_number} day={d} />)}
        </Sec>
      </Card>
    </div>
  );
}

// ===== PENDANT =====
function During({ dayNumber, today, tomorrow, upcoming, spent, days, stats }) {
  const ov = stats?.overview || {};
  const total = ov.total_days || 104;
  const totalH = ov.total_budget_hotels || 0;
  const c = today ? col(today.country) : '#10b981';
  const pct = ((dayNumber / total) * 100).toFixed(0);
  const bpct = totalH > 0 ? ((spent / totalH) * 100).toFixed(0) : 0;

  return (
    <div style={{ paddingTop: 20 }}>
      {/* Aujourd'hui */}
      <Card style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge country={today?.country || ''} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#059669' }}>{today?.country}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>J{dayNumber}</div>
            <div style={{ fontSize: 10, color: '#999' }}>/ {total}</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>{dateFR(new Date())}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>{today?.destination || 'En route'}</div>
        <div style={{ height: 4, background: '#a7f3d0', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#10b981', borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: '#999' }}>
          <span>Jour {dayNumber}</span><span>{pct}%</span>
        </div>
      </Card>

      {/* Hôtel */}
      {today?.hotel_name && today.hotel_price > 0 && (
        <Card>
          <Sec label="Ce soir">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{today.hotel_name}</div>
                {today.hotel_stars > 0 && <div style={{ fontSize: 11, color: '#ca8a04', marginTop: 2 }}>{'★'.repeat(today.hotel_stars)}</div>}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#10b981' }}>{today.hotel_price}€</div>
            </div>
          </Sec>
        </Card>
      )}

      {/* Budget */}
      <Card>
        <Sec label="Budget hébergement">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 700 }}>{spent.toLocaleString('fr-FR')}€ <span style={{ fontSize: 12, fontWeight: 400, color: '#999' }}>/ {totalH.toLocaleString('fr-FR')}€</span></span>
            <span style={{ fontSize: 12, fontWeight: 600, color: parseInt(bpct) > 60 ? '#dc2626' : '#10b981' }}>{bpct}%</span>
          </div>
          <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${bpct}%`, background: parseInt(bpct) > 80 ? '#dc2626' : '#10b981', borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 10, color: '#999', marginTop: 4, textAlign: 'right' }}>
            Restant : {(totalH - spent).toLocaleString('fr-FR')}€
          </div>
        </Sec>
      </Card>

      {/* Demain */}
      {tomorrow && (
        <Card style={tomorrow.is_transition === 1 ? { background: '#fffbeb', border: '1px solid #fde68a' } : {}}>
          <Sec label="Demain">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Badge country={tomorrow.country} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{tomorrow.destination}</div>
                {tomorrow.transport_notes && (
                  <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{tomorrow.transport_notes}</div>
                )}
                {tomorrow.hotel_name && tomorrow.hotel_price > 0 && (
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{tomorrow.hotel_name} · {tomorrow.hotel_price}€</div>
                )}
              </div>
            </div>
          </Sec>
        </Card>
      )}

      {/* Prochains jours */}
      {upcoming.length > 0 && (
        <Card>
          <Sec label="Prochains jours">
            {upcoming.map(d => <MiniDay key={d.day_number} day={d} />)}
          </Sec>
        </Card>
      )}
    </div>
  );
}

// ===== APRÈS =====
function After({ stats }) {
  const bc = stats?.by_country || [];
  const ov = stats?.overview || {};
  return (
    <div style={{ paddingTop: 20 }}>
      <Card style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Voyage terminé</div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>{ov.total_days || 104} jours · {bc.length} pays</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {bc.map(c => (
            <span key={c.country} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f5f5f5', borderRadius: 6, padding: '4px 10px', fontSize: 12 }}>
              <Badge country={c.country} /> {c.country}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>{(ov.total_budget_hotels || 0).toLocaleString('fr-FR')}€</div>
        <div style={{ fontSize: 11, color: '#999' }}>Budget hébergement total</div>
      </Card>
    </div>
  );
}

// ===== PRINCIPAL =====
export default function TodayView({ days, stats, loading, error }) {
  const trip = useMemo(() => getPhase(days), [days]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid #e5e7eb', borderTopColor: '#10b981', borderRadius: '50%', animation: 'sp .7s linear infinite' }} />
      <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize: 13, color: '#999' }}>Chargement...</div>
    </div>
  );

  if (error) return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 500 }}>{error}</div>
      <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Vérifie ta connexion</div>
    </div>
  );

  if (trip.phase === 'before') return <Before daysUntil={trip.daysUntil} days={days} stats={stats} />;
  if (trip.phase === 'during') return <During {...trip} days={days} stats={stats} />;
  return <After stats={stats} />;
}
