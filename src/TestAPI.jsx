import { useState, useEffect } from 'react';
import { fetchStats, fetchDestinations } from './services/api';

export default function TestAPI() {
  const [stats, setStats] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function test() {
      try {
        const s = await fetchStats();
        const d = await fetchDestinations();
        setStats(s.totals);
        setDestinations(d);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    test();
  }, []);

  if (loading) return <div style={{padding: 40}}>Chargement API...</div>;

  return (
    <div style={{padding: 40, fontFamily: 'system-ui'}}>
      <h1>🎉 Test API TripFlow</h1>
      
      <h2>Statistiques</h2>
      <ul>
        <li><strong>{stats?.total_destinations}</strong> destinations</li>
        <li><strong>{stats?.total_pois}</strong> POI</li>
        <li><strong>{stats?.total_must_see}</strong> incontournables</li>
        <li><strong>{stats?.total_family_friendly}</strong> adaptés familles</li>
      </ul>

      <h2>Destinations ({destinations.length})</h2>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
        {destinations.map(d => (
          <div key={d.id} style={{
            padding: '8px 16px',
            background: '#f0f0f0',
            borderRadius: 8
          }}>
            {d.name} ({d.country})
          </div>
        ))}
      </div>
    </div>
  );
}
