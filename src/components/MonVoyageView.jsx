import { useState, useEffect, useRef } from 'react';

const API_BASE = 'https://tripflow-api.youssef-amrouche.workers.dev';

const COUNTRY_COLORS = {
  'Arabie Saoudite': '#059669',
  'Maldives': '#06b6d4',
  'Singapour': '#ec4899',
  'Philippines': '#3b82f6',
  'Cambodge': '#8b5cf6',
  'Vietnam': '#eab308',
  'Thaïlande': '#ef4444',
  'Indonésie': '#22c55e',
};
const COUNTRY_FLAGS = {
  'Arabie Saoudite': '\u{1F1F8}\u{1F1E6}',
  'Maldives': '\u{1F1F2}\u{1F1FB}',
  'Singapour': '\u{1F1F8}\u{1F1EC}',
  'Philippines': '\u{1F1F5}\u{1F1ED}',
  'Cambodge': '\u{1F1F0}\u{1F1ED}',
  'Vietnam': '\u{1F1FB}\u{1F1F3}',
  'Thaïlande': '\u{1F1F9}\u{1F1ED}',
  'Indonésie': '\u{1F1EE}\u{1F1E9}',
};
const COUNTRY_LIST = Object.keys(COUNTRY_COLORS);
const getColor = (c) => COUNTRY_COLORS[c] || '#6b7280';

// ===== SVG ICONS =====
const ICONS = {
  calendar: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z',
  globe: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  money: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
  hotel: 'M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM19 7h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4zm2 8h-8V9h6c1.1 0 2 .9 2 2v4z',
  plane: 'M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  bus: 'M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z',
  arrow: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
  edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
};
const Ic = ({ name, size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d={ICONS[name]} /></svg>
);

// ===== STAT CARD =====
const StatCard = ({ icon, value, label, color }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'white', borderRadius: 10, padding: '12px 16px',
    border: '1px solid #e5e7eb', flex: 1, minWidth: 130,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 8,
      background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Ic name={icon} size={18} color={color} />
    </div>
    <div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#6b7280' }}>{label}</div>
    </div>
  </div>
);

// ===== INPUT STYLE =====
const inputStyle = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db',
  fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box',
};
const selectStyle = { ...inputStyle, background: 'white' };
const labelStyle = { fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 3, display: 'block' };

// ===== SMALL BUTTON =====
const SmBtn = ({ children, onClick, color = '#6b7280', bg = '#f3f4f6', title = '' }) => (
  <button title={title} onClick={onClick} style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
    background: bg, color, transition: 'all 0.15s', flexShrink: 0,
  }}
    onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; }}
    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
  >{children}</button>
);

// ===== ADD DAY FORM =====
const AddDayForm = ({ afterDay, onSave, onCancel }) => {
  const prevCountry = afterDay ? afterDay.country : COUNTRY_LIST[0];
  const prevFlag = afterDay ? afterDay.country_flag : COUNTRY_FLAGS[COUNTRY_LIST[0]];

  const [form, setForm] = useState({
    destination: '',
    country: prevCountry,
    country_flag: prevFlag,
    hotel_name: '',
    hotel_price: 0,
    transport_notes: '',
    is_transition: 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.destination.trim()) return alert('Remplis la destination');
    setSaving(true);
    try {
      const dayNumber = afterDay ? afterDay.day_number + 1 : 1;
      await fetch(`${API_BASE}/api/voyage/days`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day_number: dayNumber,
          date: '',
          country: form.country,
          country_flag: form.country_flag,
          destination: form.destination.toUpperCase(),
          hotel_name: form.hotel_name,
          hotel_price: parseInt(form.hotel_price) || 0,
          transport_notes: form.transport_notes || null,
        }),
      });
      onSave();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      margin: '8px 0 8px 44px', borderRadius: 10, border: '2px dashed #14B8A6',
      background: '#f0fdfa', padding: 16, animation: 'fadeIn .2s ease',
    }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}`}</style>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#14B8A6', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Ic name="add" size={16} color="#14B8A6" /> Ajouter un jour
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={labelStyle}>Pays</label>
          <select style={selectStyle} value={form.country} onChange={e => {
            const c = e.target.value;
            setForm(f => ({ ...f, country: c, country_flag: COUNTRY_FLAGS[c] || '' }));
          }}>
            {COUNTRY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Destination</label>
          <input style={inputStyle} value={form.destination} placeholder="EX: UBUD, BANGKOK..."
            onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>Hôtel</label>
          <input style={inputStyle} value={form.hotel_name} placeholder="Nom de l'hôtel"
            onChange={e => setForm(f => ({ ...f, hotel_name: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>Prix/nuit (€)</label>
          <input style={inputStyle} type="number" value={form.hotel_price}
            onChange={e => setForm(f => ({ ...f, hotel_price: e.target.value }))} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Notes transport</label>
          <input style={inputStyle} value={form.transport_notes} placeholder="Ex: Vol, bus, ferry..."
            onChange={e => setForm(f => ({ ...f, transport_notes: e.target.value }))} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_transition === 1}
              onChange={e => setForm(f => ({ ...f, is_transition: e.target.checked ? 1 : 0 }))} />
            Jour de transition / déplacement
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{
          padding: '7px 16px', borderRadius: 8, border: '1px solid #d1d5db',
          background: 'white', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#374151',
        }}>Annuler</button>
        <button onClick={handleSave} disabled={saving} style={{
          padding: '7px 16px', borderRadius: 8, border: 'none',
          background: '#14B8A6', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          opacity: saving ? 0.6 : 1,
        }}>{saving ? 'Ajout...' : 'Ajouter'}</button>
      </div>
    </div>
  );
};

// ===== DAY CARD =====
const DayCard = ({ day, isFirst, isLast, color, onUpdate, onDelete, onAddAfter, showAddForm, onToggleAdd }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isTransit = day.is_transition === 1;
  const hasArrow = day.destination.includes('\u2192');
  const parts = hasArrow ? day.destination.split('\u2192').map(s => s.trim()) : [];
  const [hover, setHover] = useState(false);

  const startEdit = () => {
    setForm({
      destination: day.destination,
      hotel_name: day.hotel_name || '',
      hotel_price: day.hotel_price || 0,
      transport_notes: day.transport_notes || '',
      is_transition: day.is_transition || 0,
      country: day.country,
      country_flag: day.country_flag,
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await fetch(`${API_BASE}/api/voyage/days/${day.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: form.destination.toUpperCase(),
          hotel_name: form.hotel_name,
          hotel_price: parseInt(form.hotel_price) || 0,
          transport_notes: form.transport_notes || null,
          is_transition: form.is_transition,
          country: form.country,
          country_flag: form.country_flag,
        }),
      });
      setEditing(false);
      onUpdate();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_BASE}/api/voyage/days/${day.id}`, { method: 'DELETE' });
      setConfirmDelete(false);
      onDelete();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', position: 'relative' }}>
        {/* Timeline */}
        <div style={{ width: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flexShrink: 0 }}>
          {!isFirst && <div style={{ position: 'absolute', top: 0, width: 2, height: '50%', background: isTransit ? `repeating-linear-gradient(to bottom, ${color}40, ${color}40 4px, transparent 4px, transparent 8px)` : `${color}25` }} />}
          <div style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 2,
            width: isTransit ? 14 : 10, height: isTransit ? 14 : 10, borderRadius: '50%',
            background: isTransit ? 'white' : color,
            border: isTransit ? `2.5px solid ${color}` : 'none',
            boxShadow: `0 0 0 3px ${color}12`,
          }} />
          {!isLast && <div style={{ position: 'absolute', bottom: 0, width: 2, height: '50%', background: `${color}25` }} />}
        </div>

        {/* Card */}
        <div
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
          style={{
            flex: 1, margin: '3px 0', borderRadius: 10, overflow: 'hidden',
            border: editing ? `2px solid ${color}` : isTransit ? `1px dashed ${color}45` : '1px solid #e5e7eb',
            background: editing ? `${color}03` : isTransit ? `${color}04` : 'white',
            boxShadow: hover && !editing ? '0 4px 12px rgba(0,0,0,0.07)' : editing ? `0 4px 16px ${color}20` : 'none',
            transform: hover && !editing ? 'translateX(2px)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          {/* MODE LECTURE */}
          {!editing ? (
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              {/* Jour number */}
              <div style={{
                width: 66, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '10px 6px', background: isTransit ? `${color}08` : '#f9fafb',
                borderRight: '1px solid #f3f4f6', flexShrink: 0,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jour</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>{day.day_number}</div>
                <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 1 }}>{day.date ? day.date.replace(/^[A-Za-z]+ /, '') : ''}</div>
              </div>

              {/* Destination */}
              <div style={{ flex: 1, padding: '10px 14px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {isTransit && hasArrow ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: '#6b7280', background: '#f3f4f6', padding: '2px 7px', borderRadius: 4 }}>{parts[0]}</span>
                      <Ic name="arrow" size={14} color={color} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#111827', background: `${color}12`, padding: '2px 8px', borderRadius: 4 }}>{parts[1]}</span>
                    </div>
                    {day.transport_notes && (
                      <div style={{ marginTop: 4, fontSize: 11, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Ic name={day.transport_notes.toLowerCase().includes('vol') ? 'plane' : 'bus'} size={11} color="#9ca3af" />
                        {day.transport_notes}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{day.destination}</div>
                )}
              </div>

              {/* Hotel + prix */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', flexShrink: 0 }}>
                {day.hotel_name && !['Vol retour', 'Vol transit', 'Transit'].includes(day.hotel_name) && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#374151', fontWeight: 500, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{day.hotel_name}</div>
                    {day.hotel_stars > 0 && <div style={{ fontSize: 9, color: '#d97706' }}>{'★'.repeat(day.hotel_stars)}</div>}
                  </div>
                )}
                <div style={{
                  fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap',
                  color: day.hotel_price > 0 ? '#111827' : '#9ca3af',
                  background: day.hotel_price > 0 ? '#f0fdf4' : '#f9fafb',
                  padding: '4px 8px', borderRadius: 6, minWidth: 50, textAlign: 'center',
                }}>
                  {day.hotel_price > 0 ? `${day.hotel_price}\u20AC` : '\u2014'}
                </div>

                {/* Action buttons */}
                <div style={{
                  display: 'flex', gap: 4, opacity: hover ? 1 : 0, transition: 'opacity .15s',
                }}>
                  <SmBtn title="Modifier" onClick={startEdit} color="#14B8A6" bg="#f0fdfa">
                    <Ic name="edit" size={13} color="#14B8A6" />
                  </SmBtn>
                  <SmBtn title="Supprimer" onClick={() => setConfirmDelete(true)} color="#ef4444" bg="#fef2f2">
                    <Ic name="trash" size={13} color="#ef4444" />
                  </SmBtn>
                </div>
              </div>
            </div>
          ) : (
            /* MODE ÉDITION */
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color }}>
                  Modifier Jour {day.day_number}
                </div>
                <SmBtn onClick={() => setEditing(false)} color="#6b7280" bg="#f3f4f6" title="Annuler">
                  <Ic name="close" size={14} color="#6b7280" />
                </SmBtn>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>Pays</label>
                  <select style={selectStyle} value={form.country} onChange={e => {
                    const c = e.target.value;
                    setForm(f => ({ ...f, country: c, country_flag: COUNTRY_FLAGS[c] || '' }));
                  }}>
                    {COUNTRY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Destination</label>
                  <input style={inputStyle} value={form.destination}
                    onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Hôtel</label>
                  <input style={inputStyle} value={form.hotel_name}
                    onChange={e => setForm(f => ({ ...f, hotel_name: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Prix/nuit (\u20AC)</label>
                  <input style={inputStyle} type="number" value={form.hotel_price}
                    onChange={e => setForm(f => ({ ...f, hotel_price: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Notes transport</label>
                  <input style={inputStyle} value={form.transport_notes}
                    onChange={e => setForm(f => ({ ...f, transport_notes: e.target.value }))} />
                </div>
                <div>
                  <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.is_transition === 1}
                      onChange={e => setForm(f => ({ ...f, is_transition: e.target.checked ? 1 : 0 }))} />
                    Jour de transition
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
                <button onClick={() => setEditing(false)} style={{
                  padding: '7px 16px', borderRadius: 8, border: '1px solid #d1d5db',
                  background: 'white', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#374151',
                }}>Annuler</button>
                <button onClick={saveEdit} disabled={saving} style={{
                  padding: '7px 16px', borderRadius: 8, border: 'none',
                  background: color, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  opacity: saving ? 0.6 : 1,
                }}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
              </div>
            </div>
          )}

          {/* Confirm delete modal */}
          {confirmDelete && (
            <div style={{
              padding: '12px 16px', background: '#fef2f2', borderTop: '1px solid #fecaca',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 12, color: '#991b1b', fontWeight: 500 }}>
                Supprimer le jour {day.day_number} ?
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setConfirmDelete(false)} style={{
                  padding: '5px 12px', borderRadius: 6, border: '1px solid #d1d5db',
                  background: 'white', fontSize: 11, cursor: 'pointer', color: '#374151',
                }}>Non</button>
                <button onClick={handleDelete} style={{
                  padding: '5px 12px', borderRadius: 6, border: 'none',
                  background: '#ef4444', color: 'white', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                }}>Oui, supprimer</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bouton + entre les jours */}
      {!isLast && (
        <div style={{ display: 'flex', marginLeft: 44, position: 'relative' }}>
          <button
            onClick={() => onToggleAdd(day.day_number)}
            style={{
              width: '100%', padding: '2px 0', margin: '0', border: 'none',
              background: 'transparent', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', opacity: showAddForm ? 1 : 0,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={e => { if (!showAddForm) e.currentTarget.style.opacity = '0'; }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 10,
              color: '#14B8A6', fontWeight: 600, background: '#f0fdfa',
              padding: '2px 10px', borderRadius: 10, border: '1px dashed #14B8A6',
            }}>
              <Ic name="add" size={12} color="#14B8A6" /> Ajouter ici
            </div>
          </button>
        </div>
      )}

      {/* Formulaire d'ajout */}
      {showAddForm && <AddDayForm afterDay={day} onSave={onAddAfter} onCancel={() => onToggleAdd(null)} />}
    </>
  );
};

// ===== COUNTRY SECTION =====
const CountrySection = ({ group, sectionRef, onRefresh, addFormAt, onToggleAdd }) => {
  const color = getColor(group.country);
  const budget = group.days.reduce((s, d) => s + (d.hotel_price || 0), 0);
  return (
    <div ref={sectionRef} style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 18px', borderRadius: 12, marginBottom: 10,
        background: `linear-gradient(135deg, ${color}10, ${color}05)`,
        border: `1px solid ${color}20`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>{group.country_flag}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{group.country}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>
              {group.days[0] && group.days[0].date ? group.days[0].date.replace(/^[A-Za-z]+ /, '') : ''} → {group.days[group.days.length - 1] && group.days[group.days.length - 1].date ? group.days[group.days.length - 1].date.replace(/^[A-Za-z]+ /, '') : ''} · {group.days.length} jours
            </div>
          </div>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color, background: `${color}10`, padding: '5px 12px', borderRadius: 8 }}>
          {budget.toLocaleString('fr-FR')}\u20AC
        </div>
      </div>
      <div style={{ paddingLeft: 6 }}>
        {group.days.map((d, i) => (
          <DayCard
            key={d.id || d.day_number}
            day={d}
            isFirst={i === 0}
            isLast={i === group.days.length - 1}
            color={color}
            onUpdate={onRefresh}
            onDelete={onRefresh}
            onAddAfter={onRefresh}
            showAddForm={addFormAt === d.day_number}
            onToggleAdd={onToggleAdd}
          />
        ))}
      </div>
    </div>
  );
};

// ============ COMPOSANT PRINCIPAL ============
export default function MonVoyageView({ onAddFavorite, favorites, apiData }) {
  const [days, setDays] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCountry, setActiveCountry] = useState(null);
  const [addFormAt, setAddFormAt] = useState(null);
  const refs = useRef({});

  const fetchData = async () => {
    try {
      const [dr, sr] = await Promise.all([
        fetch(`${API_BASE}/api/voyage/days`), fetch(`${API_BASE}/api/voyage/stats`)
      ]);
      const dd = await dr.json(), sd = await sr.json();
      setDays(dd.days || []); setStats(sd);
    } catch (e) { console.error('Erreur chargement voyage:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = () => {
    setAddFormAt(null);
    fetchData();
  };

  const handleToggleAdd = (dayNum) => {
    setAddFormAt(prev => prev === dayNum ? null : dayNum);
  };

  const groups = [];
  let cur = null;
  days.forEach(d => {
    if (!cur || cur.country !== d.country) {
      cur = { country: d.country, country_flag: d.country_flag, days: [] };
      groups.push(cur);
    }
    cur.days.push(d);
  });

  const scrollTo = (c) => {
    setActiveCountry(c);
    if (refs.current[c]) refs.current[c].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#14B8A6', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ color: '#6b7280', fontSize: 14 }}>Chargement du voyage...</div>
    </div>
  );

  const ov = stats && stats.overview ? stats.overview : {};
  const bc = stats && stats.by_country ? stats.by_country : [];
  const hotelCount = new Set(days.filter(d => d.hotel_name && d.hotel_price > 0).map(d => d.hotel_name)).size;

  return (
    <div style={{ maxWidth: 920, margin: '0 auto' }}>

      {/* ===== HEADER ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #0d9488, #14b8a6, #2dd4bf)',
        borderRadius: 16, padding: 22, marginBottom: 18, color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, opacity: .8, marginBottom: 3 }}>Mon Voyage</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 3 }}>Tour d'Asie 2026</div>
          <div style={{ fontSize: 12, opacity: .8, marginBottom: 14 }}>24 mars \u2192 5 juillet \u00B7 {bc.length} pays \u00B7 Famille</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <StatCard icon="calendar" value={(ov.total_days || 0) + 'j'} label="Dur\u00E9e totale" color="#14B8A6" />
            <StatCard icon="globe" value={bc.length} label="Pays visit\u00E9s" color="#8b5cf6" />
            <StatCard icon="money" value={(ov.total_budget_hotels || 0).toLocaleString('fr-FR') + '\u20AC'} label="Budget h\u00F4tels" color="#f97316" />
            <StatCard icon="hotel" value={hotelCount} label="H\u00F4tels" color="#ec4899" />
          </div>
        </div>
      </div>

      {/* ===== NAV PAYS ===== */}
      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '2px 0 10px', marginBottom: 6, scrollbarWidth: 'none' }}>
        <button onClick={() => { setActiveCountry(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 18, border: 'none',
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .2s', fontSize: 12,
            background: !activeCountry ? '#14B8A6' : 'white', color: !activeCountry ? 'white' : '#374151',
            fontWeight: !activeCountry ? 600 : 400, boxShadow: !activeCountry ? '0 2px 8px rgba(20,184,166,.4)' : '0 1px 3px rgba(0,0,0,.08)',
          }}>
          <Ic name="globe" size={13} color={!activeCountry ? 'white' : '#6b7280'} /> Tout
        </button>
        {bc.map(c => {
          const clr = getColor(c.country); const act = activeCountry === c.country;
          return (
            <button key={c.country} onClick={() => scrollTo(c.country)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 18,
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .2s', fontSize: 12,
                background: act ? clr : 'white', color: act ? 'white' : '#374151',
                fontWeight: act ? 600 : 400, boxShadow: act ? `0 2px 8px ${clr}40` : '0 1px 3px rgba(0,0,0,.08)',
              }}>
              <span style={{ fontSize: 15 }}>{c.country_flag}</span>
              <span>{c.country}</span>
              <span style={{ fontSize: 10, fontWeight: 600, opacity: act ? .9 : .5, background: act ? 'rgba(255,255,255,.2)' : '#f3f4f6', padding: '1px 5px', borderRadius: 8 }}>{c.days}j</span>
            </button>
          );
        })}
      </div>

      {/* ===== BARRE DE PROGRESSION ===== */}
      <div style={{ background: 'white', borderRadius: 10, padding: '10px 14px', border: '1px solid #e5e7eb', marginBottom: 18 }}>
        <div style={{ display: 'flex', height: 7, borderRadius: 4, overflow: 'hidden', gap: 2 }}>
          {bc.map(c => (
            <div key={c.country} onClick={() => scrollTo(c.country)}
              title={c.country_flag + ' ' + c.country + ' \u00B7 ' + c.days + 'j \u00B7 ' + (c.budget ? c.budget.toLocaleString('fr-FR') : 0) + '\u20AC'}
              style={{
                flex: c.days, background: getColor(c.country), borderRadius: 3, cursor: 'pointer',
                transition: 'opacity .2s', opacity: activeCountry && activeCountry !== c.country ? .3 : 1,
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 9, color: '#9ca3af' }}>
          <span>24 mars</span><span>5 juillet</span>
        </div>
      </div>

      {/* ===== TIMELINE ===== */}
      {groups.map(g => (
        <CountrySection
          key={g.country}
          group={g}
          sectionRef={el => { refs.current[g.country] = el; }}
          onRefresh={handleRefresh}
          addFormAt={addFormAt}
          onToggleAdd={handleToggleAdd}
        />
      ))}

      {/* ===== FOOTER RECAP ===== */}
      <div style={{ background: 'white', borderRadius: 12, padding: 18, border: '1px solid #e5e7eb', marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>R\u00E9capitulatif Budget H\u00E9bergement</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{ov.total_days || 0} nuits \u00B7 {bc.length} pays \u00B7 {hotelCount} h\u00F4tels</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: '#14B8A6' }}>{(ov.total_budget_hotels || 0).toLocaleString('fr-FR')}</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#6b7280' }}>{'\u20AC'}</span>
        </div>
      </div>

      {/* ===== BUDGET PAR PAYS ===== */}
      <div style={{ background: 'white', borderRadius: 12, padding: 18, border: '1px solid #e5e7eb', marginTop: 10, marginBottom: 40 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 14 }}>R\u00E9partition par pays</div>
        {bc.map(c => {
          const pct = ov.total_budget_hotels > 0 ? ((c.budget / ov.total_budget_hotels) * 100).toFixed(0) : 0;
          return (
            <div key={c.country} style={{ marginBottom: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span>{c.country_flag}</span>
                  <span style={{ fontWeight: 500, color: '#374151' }}>{c.country}</span>
                  <span style={{ color: '#9ca3af', fontSize: 10 }}>{c.days}j</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>
                  {c.budget ? c.budget.toLocaleString('fr-FR') : 0}{'\u20AC'}
                  <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: 3, fontSize: 10 }}>({pct}%)</span>
                </div>
              </div>
              <div style={{ height: 5, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: pct + '%', background: getColor(c.country), borderRadius: 3, transition: 'width .5s ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
