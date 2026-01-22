import { useMemo } from 'react';
import { Icon } from '../ui';
import { DESTINATIONS, COUNTRIES } from '../../data/config';

const BUDGET_CATEGORIES = [
  { id: 'transports', label: 'Transports', icon: 'plane', color: '#3b82f6' },
  { id: 'hebergements', label: 'Hébergements', icon: 'bed', color: '#8b5cf6' },
  { id: 'activites', label: 'Activités', icon: 'activity', color: '#f59e0b' },
  { id: 'repas', label: 'Restauration', icon: 'utensils', color: '#10b981' },
  { id: 'divers', label: 'Divers/Marge', icon: 'wallet', color: '#6b7280' }
];

export function BudgetSummary({ stats, etapes, jours }) {
  // Calcul par destination
  const budgetByDestination = useMemo(() => {
    return etapes.map(etape => {
      const dest = DESTINATIONS[etape.destination_id];
      const country = COUNTRIES[dest?.country];
      
      const hebergement = etape.hebergement_prix * etape.nb_nuits;
      const transport = etape.transport_cout || 0;
      
      // Activités et repas pour cette étape
      const etapeJours = jours.filter(j => j.etape_id === etape.id);
      let activites = 0;
      let repas = 0;
      
      etapeJours.forEach(jour => {
        // Activités
        ['matin', 'apresmidi', 'soir'].forEach(c => {
          (jour.activites?.[c] || []).forEach(a => {
            activites += a.cout || 0;
          });
        });
        // Repas
        ['petitdej', 'dejeuner', 'diner'].forEach(r => {
          repas += jour.repas?.[r]?.cout || (r === 'petitdej' ? 5 : r === 'dejeuner' ? 15 : 20);
        });
      });

      const total = hebergement + transport + activites + repas;

      return {
        id: etape.destination_id,
        name: dest?.name,
        country: country,
        nights: etape.nb_nuits,
        hebergement,
        transport,
        activites,
        repas,
        total,
        perNight: Math.round(total / etape.nb_nuits)
      };
    });
  }, [etapes, jours]);

  const totalBudget = stats.budget || 30000;
  const totalSpent = stats.total || 0;
  const remaining = totalBudget - totalSpent;
  const percentUsed = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div style={{ padding: 24 }}>
      {/* Cards résumé */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 16,
        marginBottom: 32
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
            Budget total
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#111827' }}>
            {totalBudget.toLocaleString()}€
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
            Dépenses planifiées
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#6366f1' }}>
            {totalSpent.toLocaleString()}€
          </div>
          <div style={{ 
            marginTop: 8,
            height: 6,
            backgroundColor: '#e5e7eb',
            borderRadius: 3,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(percentUsed, 100)}%`,
              height: '100%',
              backgroundColor: percentUsed > 90 ? '#ef4444' : '#6366f1',
              borderRadius: 3,
              transition: 'width 0.3s'
            }} />
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            {percentUsed}% du budget
          </div>
        </div>

        <div style={{
          backgroundColor: remaining >= 0 ? '#f0fdf4' : '#fef2f2',
          borderRadius: 12,
          padding: 20,
          border: `1px solid ${remaining >= 0 ? '#bbf7d0' : '#fecaca'}`
        }}>
          <div style={{ fontSize: 13, color: remaining >= 0 ? '#166534' : '#dc2626', marginBottom: 8 }}>
            {remaining >= 0 ? 'Reste disponible' : 'Dépassement'}
          </div>
          <div style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            color: remaining >= 0 ? '#15803d' : '#dc2626'
          }}>
            {Math.abs(remaining).toLocaleString()}€
          </div>
          {remaining >= 0 && (
            <div style={{ fontSize: 12, color: '#166534', marginTop: 4 }}>
              ✅ Marge confortable
            </div>
          )}
        </div>
      </div>

      {/* Répartition par catégorie */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        padding: 24,
        marginBottom: 24
      }}>
        <h3 style={{ 
          fontSize: 16, 
          fontWeight: 600, 
          color: '#111827',
          marginBottom: 20
        }}>
          Répartition par catégorie
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {BUDGET_CATEGORIES.map(cat => {
            const amount = stats[cat.id] || 0;
            const percent = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;

            return (
              <div key={cat.id}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: cat.color + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon name={cat.icon} size={18} style={{ color: cat.color }} />
                    </div>
                    <span style={{ fontWeight: 500, color: '#374151' }}>
                      {cat.label}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 600, color: '#111827' }}>
                      {amount.toLocaleString()}€
                    </span>
                    <span style={{ fontSize: 13, color: '#6b7280', marginLeft: 8 }}>
                      {percent}%
                    </span>
                  </div>
                </div>
                <div style={{
                  height: 8,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percent}%`,
                    height: '100%',
                    backgroundColor: cat.color,
                    borderRadius: 4,
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Détail par destination */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>
            Détail par destination
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                  DESTINATION
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                  NUITS
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                  HÉBERGEMENT
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                  TRANSPORT
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                  ACTIVITÉS
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                  REPAS
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                  TOTAL
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                  /NUIT
                </th>
              </tr>
            </thead>
            <tbody>
              {budgetByDestination.map((dest, index) => (
                <tr 
                  key={dest.id}
                  style={{ 
                    borderBottom: index < budgetByDestination.length - 1 ? '1px solid #e5e7eb' : 'none'
                  }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        backgroundColor: dest.country?.color || '#6366f1',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {index + 1}
                      </div>
                      <span style={{ fontWeight: 500, color: '#111827' }}>
                        {dest.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#6b7280' }}>
                    {dest.nights}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#374151' }}>
                    {dest.hebergement.toLocaleString()}€
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#374151' }}>
                    {dest.transport.toLocaleString()}€
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#374151' }}>
                    {dest.activites.toLocaleString()}€
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#374151' }}>
                    {dest.repas.toLocaleString()}€
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                    {dest.total.toLocaleString()}€
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#6366f1', fontWeight: 500 }}>
                    {dest.perNight}€
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#111827' }}>
                  TOTAL
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                  {budgetByDestination.reduce((sum, d) => sum + d.nights, 0)}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                  {budgetByDestination.reduce((sum, d) => sum + d.hebergement, 0).toLocaleString()}€
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                  {budgetByDestination.reduce((sum, d) => sum + d.transport, 0).toLocaleString()}€
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                  {budgetByDestination.reduce((sum, d) => sum + d.activites, 0).toLocaleString()}€
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                  {budgetByDestination.reduce((sum, d) => sum + d.repas, 0).toLocaleString()}€
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#6366f1', fontSize: 16 }}>
                  {budgetByDestination.reduce((sum, d) => sum + d.total, 0).toLocaleString()}€
                </td>
                <td style={{ padding: '14px 16px' }}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
