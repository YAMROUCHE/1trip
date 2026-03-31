import { useState, useEffect, useCallback } from 'react';
import TodayView from './components/TodayView';
import MonVoyageView from './components/MonVoyageView';
import BudgetView from './components/BudgetView';

const API = 'https://tripflow-api.youssef-amrouche.workers.dev';

const TABS = [
  { id: 'today', label: "Aujourd'hui", path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' },
  { id: 'voyage', label: 'Itinéraire', path: 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z' },
  { id: 'budget', label: 'Budget', path: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z' },
];

function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      display: 'flex', justifyContent: 'center',
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
    }}>
      {TABS.map(t => {
        const act = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            flex: 1, maxWidth: 120,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 2, padding: '10px 0 6px', background: 'none', border: 'none',
            cursor: 'pointer', color: act ? '#10b981' : '#9ca3af',
            transition: 'color 0.15s',
          }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill={act ? '#10b981' : '#9ca3af'}>
              <path d={t.path} />
            </svg>
            <span style={{ fontSize: 10, fontWeight: act ? 600 : 400 }}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function App() {
  const [tab, setTab] = useState('today');
  const [days, setDays] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [dr, sr] = await Promise.all([
        fetch(`${API}/api/voyage/days`),
        fetch(`${API}/api/voyage/stats`),
      ]);
      if (!dr.ok || !sr.ok) throw new Error('API error');
      const dd = await dr.json();
      const sd = await sr.json();
      setDays(dd.days || []);
      setStats(sd);
    } catch (e) {
      console.error(e);
      setError('Connexion impossible');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleTab = (t) => {
    setTab(t);
    window.scrollTo({ top: 0 });
    if (t !== 'voyage') fetchData();
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#fafafa', paddingBottom: 76,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#1a1a1a', WebkitFontSmoothing: 'antialiased',
    }}>
      <div style={{ padding: '0 16px', maxWidth: tab === 'voyage' ? 900 : 520, margin: '0 auto' }}>
        {tab === 'today' && <TodayView days={days} stats={stats} loading={loading} error={error} />}
        {tab === 'voyage' && <MonVoyageView onRefreshGlobal={fetchData} />}
        {tab === 'budget' && <BudgetView days={days} stats={stats} loading={loading} error={error} />}
      </div>
      <BottomNav active={tab} onChange={handleTab} />
    </div>
  );
}
