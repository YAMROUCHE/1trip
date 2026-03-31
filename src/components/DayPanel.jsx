import { useState, useEffect } from 'react';

const API = 'https://tripflow-api.youssef-amrouche.workers.dev';

const TYPE_GRADIENTS = {
  temple: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  beach: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
  nature: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  cultural: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  restaurant: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  market: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  activity: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  waterfall: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
  museum: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
  default: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
};
const TYPE_LABELS = {
  temple:'Temple', beach:'Plage', nature:'Nature', cultural:'Culture',
  restaurant:'Restaurant', market:'March\u00e9', activity:'Activit\u00e9',
  waterfall:'Cascade', museum:'Mus\u00e9e', viewpoint:'Vue',
  island:'\u00cele', lake:'Lac', park:'Parc', cave:'Grotte',
  historical:'Historique', snorkeling:'Snorkeling', diving:'Plong\u00e9e',
};
const PRICE = { 1:'\u20ac', 2:'\u20ac\u20ac', 3:'\u20ac\u20ac\u20ac', 4:'\u20ac\u20ac\u20ac\u20ac' };

function extractDest(raw) {
  if (!raw) return '';
  var s = raw.indexOf('\u2192') !== -1 ? raw.split('\u2192').pop().trim() : raw.trim();
  return s.replace(/^(VOL |BUS |FERRY |TRAIN )/i, '').trim();
}

// ============================================
// POI CARD
// ============================================
function PoiCard({ poi, onAdd, adding }) {
  const [err, setErr] = useState(false);
  const hasImg = poi.image_url && !err;
  const grad = TYPE_GRADIENTS[poi.type] || TYPE_GRADIENTS.default;

  return (
    <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid #e5e7eb', background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ height:100, position:'relative', overflow:'hidden', background: hasImg ? '#f3f4f6' : grad }}>
        {hasImg && <img src={poi.image_url} alt={poi.name} onError={()=>setErr(true)} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
        {!hasImg && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, opacity:0.3, color:'#fff' }}>{'\u{1F4CD}'}</div>}
        {poi.must_see === 1 && <div style={{ position:'absolute', top:6, left:6, background:'#fbbf24', color:'#78350f', fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:4 }}>{'\u2b50'} Incontournable</div>}
        {poi.family_friendly === 1 && <div style={{ position:'absolute', top:6, right:6, background:'rgba(255,255,255,0.9)', color:'#059669', fontSize:9, fontWeight:600, padding:'2px 6px', borderRadius:4 }}>{'\u{1F46A}'} Famille</div>}
      </div>
      <div style={{ padding:'8px 10px 10px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:6 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', lineHeight:1.2 }}>{poi.name}</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
              <span style={{ fontSize:9, fontWeight:600, padding:'1px 5px', borderRadius:3, background:'#f3f4f6', color:'#666' }}>{TYPE_LABELS[poi.type]||poi.type||'Lieu'}</span>
              {poi.price_level > 0 && <span style={{ fontSize:10, color:'#999' }}>{PRICE[poi.price_level]||''}</span>}
            </div>
          </div>
          <button onClick={()=>onAdd(poi)} disabled={adding} style={{ background: adding?'#d1d5db':'#10b981', color:'#fff', border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, fontWeight:600, cursor: adding?'default':'pointer', flexShrink:0, fontFamily:'inherit' }}>
            {adding ? '...' : '+ Ajouter'}
          </button>
        </div>
        {poi.description && <div style={{ fontSize:11, color:'#888', marginTop:5, lineHeight:1.35, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{poi.description}</div>}
      </div>
    </div>
  );
}

// ============================================
// HOTEL CARD
// ============================================
function HotelCard({ hotel, isActive, onSelect }) {
  const [err, setErr] = useState(false);
  const hasImg = hotel.image_url && !err;
  return (
    <div onClick={()=>onSelect(hotel)} style={{ borderRadius:10, overflow:'hidden', cursor:'pointer', border: isActive?'2px solid #10b981':'1px solid #e5e7eb', background: isActive?'#ecfdf5':'#fff', transition:'all 0.15s', minWidth:180, maxWidth:220, flexShrink:0 }}>
      <div style={{ height:70, background: hasImg?'#f3f4f6':'linear-gradient(135deg,#6366f1,#4f46e5)', position:'relative', overflow:'hidden' }}>
        {hasImg && <img src={hotel.image_url} alt={hotel.name} onError={()=>setErr(true)} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
        {!hasImg && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, opacity:0.4, color:'#fff' }}>{'\u{1F3E8}'}</div>}
        {hotel.recommande===1 && <div style={{ position:'absolute', top:4, right:4, background:'#10b981', color:'#fff', fontSize:8, fontWeight:700, padding:'2px 5px', borderRadius:3 }}>{'\u2714'} Recommand\u00e9</div>}
        {isActive && <div style={{ position:'absolute', top:4, left:4, background:'#10b981', color:'#fff', fontSize:8, fontWeight:700, padding:'2px 5px', borderRadius:3 }}>{'\u2714'} S\u00e9lectionn\u00e9</div>}
      </div>
      <div style={{ padding:'6px 8px 8px' }}>
        <div style={{ fontSize:12, fontWeight:600, color:'#1a1a1a', lineHeight:1.2 }}>{hotel.name}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:3 }}>
          {hotel.stars>0 && <span style={{ fontSize:10, color:'#ca8a04' }}>{'\u2605'.repeat(hotel.stars)}</span>}
          <span style={{ fontSize:12, fontWeight:700, color:'#10b981' }}>{hotel.price_night||hotel.price_eur||'?'}{'\u20ac'}/nuit</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SECTION HOTELS
// ============================================
export function HotelSection({ day, onUpdate }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const dest = extractDest(day.destination);
    if (!dest) { setLoading(false); return; }
    fetch(API+'/api/hotels?destination_name='+encodeURIComponent(dest))
      .then(r=>r.json()).then(d=>setHotels(d.hotels||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, [day.destination]);
  const handleSelect = async (hotel) => {
    await fetch(API+'/api/voyage/days/'+day.id, { method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ hotel_name:hotel.name, hotel_price:hotel.price_night||hotel.price_eur||0, hotel_stars:hotel.stars||0 }) });
    onUpdate();
  };
  if (loading) return <div style={{ fontSize:11, color:'#aaa', padding:'8px 0' }}>Chargement des h\u00f4tels...</div>;
  if (hotels.length === 0) return null;
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:12, fontWeight:700, color:'#1a1a1a', marginBottom:8 }}>{'\u{1F3E8}'} H\u00f4tels disponibles <span style={{ fontSize:10, fontWeight:400, color:'#999' }}>({hotels.length})</span></div>
      <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:6 }}>
        {hotels.map(h => <HotelCard key={h.id} hotel={h} isActive={h.name===day.hotel_name} onSelect={handleSelect} />)}
      </div>
    </div>
  );
}

// ============================================
// SECTION ACTIVITES
// ============================================
export function ActivitySection({ dayId, destName, onAdded }) {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!destName) { setLoading(false); return; }
    fetch(API+'/api/pois?destination_name='+encodeURIComponent(destName))
      .then(r=>r.json()).then(d=>setPois(d.pois||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, [destName]);
  const handleAdd = async (poi) => {
    setAdding(poi.id);
    try {
      await fetch(API+'/api/voyage/days/'+dayId+'/items', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ type: poi.type==='restaurant'?'restaurant':'activity', title:poi.name, description:poi.description||'', price:0 }) });
      onAdded();
    } catch(e){ alert('Erreur'); } finally { setAdding(null); }
  };
  if (loading) return <div style={{ fontSize:11, color:'#aaa', padding:'8px 0' }}>Chargement des activit\u00e9s...</div>;
  if (pois.length === 0) return null;
  let filtered = pois;
  if (filter==='must_see') filtered = pois.filter(p=>p.must_see===1);
  else if (filter==='family') filtered = pois.filter(p=>p.family_friendly===1);
  else if (filter!=='all') filtered = pois.filter(p=>p.type===filter);
  const types = [...new Set(pois.map(p=>p.type).filter(Boolean))];
  const displayed = showAll ? filtered : filtered.slice(0,6);
  const fbtn = (k,l,c) => <button key={k} onClick={()=>{setFilter(k);setShowAll(false);}} style={{ padding:'3px 9px', borderRadius:5, fontSize:10, fontWeight:500, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', background:filter===k?'#10b981':'#f5f5f5', color:filter===k?'#fff':'#666', border:filter===k?'none':'1px solid #e5e7eb' }}>{l} ({c})</button>;
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:12, fontWeight:700, color:'#1a1a1a', marginBottom:6 }}>{'\u{1F4CD}'} Que faire \u00e0 {destName} ? <span style={{ fontSize:10, fontWeight:400, color:'#999' }}>({pois.length} lieux)</span></div>
      <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:8 }}>
        {fbtn('all','Tout',pois.length)}
        {pois.filter(p=>p.must_see===1).length>0 && fbtn('must_see','\u2b50 Incontournables',pois.filter(p=>p.must_see===1).length)}
        {pois.filter(p=>p.family_friendly===1).length>0 && fbtn('family','\u{1F46A} Famille',pois.filter(p=>p.family_friendly===1).length)}
        {types.slice(0,6).map(t => fbtn(t, TYPE_LABELS[t]||t, pois.filter(p=>p.type===t).length))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:8 }}>
        {displayed.map(poi => <PoiCard key={poi.id} poi={poi} onAdd={handleAdd} adding={adding===poi.id} />)}
      </div>
      {filtered.length>6 && !showAll && <button onClick={()=>setShowAll(true)} style={{ display:'block', margin:'8px auto 0', padding:'5px 16px', background:'#f5f5f5', border:'1px solid #e5e7eb', borderRadius:6, fontSize:11, color:'#666', cursor:'pointer', fontFamily:'inherit' }}>Voir les {filtered.length-6} autres lieux</button>}
    </div>
  );
}

// ============================================
// SECTION TRANSPORT
// ============================================
export function TransportSection({ day, dayId, onAdded }) {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  useEffect(() => {
    const dest = extractDest(day.destination);
    if (!dest) { setLoading(false); return; }
    fetch(API+'/api/transports?destination_name='+encodeURIComponent(dest))
      .then(r=>r.json()).then(d=>setTransports(d.transports||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, [day.destination]);
  const handleAdd = async (t) => {
    setAdding(t.id);
    try {
      await fetch(API+'/api/voyage/days/'+dayId+'/items', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ type:'transport', title:t.transport_type+' '+t.from_destination+' \u2192 '+t.to_destination, description:(t.company||'')+(t.notes?' \u2014 '+t.notes:''), price:t.estimated_cost_eur||0 }) });
      onAdded();
    } catch(e){ alert('Erreur'); } finally { setAdding(null); }
  };
  if (loading) return <div style={{ fontSize:11, color:'#aaa', padding:'8px 0' }}>Chargement...</div>;
  if (transports.length === 0) return null;
  const ic = { avion:'\u2708', van:'\u{1F690}', bus:'\u{1F68C}', ferry:'\u26F4', train:'\u{1F682}', taxi:'\u{1F695}', bateau:'\u26F5' };
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:12, fontWeight:700, color:'#1a1a1a', marginBottom:8 }}>{'\u{1F697}'} Transports <span style={{ fontSize:10, fontWeight:400, color:'#999' }}>({transports.length})</span></div>
      {transports.map(t => (
        <div key={t.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:'#f9fafb', borderRadius:8, border:'1px solid #f3f4f6', marginBottom:3 }}>
          <span style={{ fontSize:18 }}>{ic[t.transport_type]||'\u{1F697}'}</span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:500 }}>{t.from_destination} {'\u2192'} {t.to_destination}</div>
            <div style={{ fontSize:10, color:'#999', marginTop:1 }}>{t.transport_type} {'\u00b7'} {t.duration_hours}h{t.company?' \u00b7 '+t.company:''}</div>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:'#10b981' }}>{t.estimated_cost_eur}{'\u20ac'}</div>
          <button onClick={()=>handleAdd(t)} disabled={adding===t.id} style={{ background:adding===t.id?'#d1d5db':'#3b82f6', color:'#fff', border:'none', borderRadius:5, padding:'4px 8px', fontSize:10, fontWeight:600, cursor:adding===t.id?'default':'pointer', fontFamily:'inherit' }}>{adding===t.id?'...':'+'}</button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// ITEMS LIST
// ============================================
export function ItemsList({ items, onRefresh }) {
  const [del, setDel] = useState(null);
  const rm = async (id) => { setDel(id); await fetch(API+'/api/voyage/items/'+id,{method:'DELETE'}); onRefresh(); setDel(null); };
  if (!items || items.length===0) return null;
  const tl = { activity:'Activit\u00e9', transport:'Transport', restaurant:'Restaurant', note:'Note' };
  const tc = { activity:'#2563eb', transport:'#7c3aed', restaurant:'#dc2626', note:'#6b7280' };
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:12, fontWeight:700, color:'#1a1a1a', marginBottom:6 }}>{'\u2705'} Planifi\u00e9 ce jour <span style={{ fontSize:10, fontWeight:400, color:'#999' }}>({items.length})</span></div>
      {items.map(it => (
        <div key={it.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', background:'#f0fdf4', borderRadius:7, marginBottom:3, fontSize:12, border:'1px solid #bbf7d0' }}>
          <span style={{ fontSize:9, fontWeight:700, color:tc[it.type]||'#666', background:(tc[it.type]||'#666')+'14', padding:'2px 6px', borderRadius:4 }}>{tl[it.type]||it.type}</span>
          <span style={{ flex:1, fontWeight:450 }}>{it.title}</span>
          {it.price>0 && <span style={{ fontWeight:700, color:'#10b981' }}>{it.price}{'\u20ac'}</span>}
          <button onClick={()=>rm(it.id)} disabled={del===it.id} style={{ background:'none', border:'none', cursor:'pointer', padding:2, opacity:del===it.id?0.3:0.5, fontSize:14, color:'#ef4444' }}>{'\u2716'}</button>
        </div>
      ))}
    </div>
  );
}
