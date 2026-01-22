import { useState, useEffect } from 'react'

const API_URL = 'https://nft-dashboard-api.youssef-amrouche.workers.dev'
const SNIPER_URL = 'https://nft-sniper-alerts.youssef-amrouche.workers.dev'

function App() {
  const [data, setData] = useState(null)
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [lastOppUpdate, setLastOppUpdate] = useState(null)
  const [filter, setFilter] = useState('ALL')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL + '/api/overview')
      if (!response.ok) throw new Error('API Error')
      const result = await response.json()
      setData(result)
      setLastUpdate(new Date())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchOpportunities = async () => {
    try {
      const oppResponse = await fetch(SNIPER_URL + '/opportunities')
      if (oppResponse.ok) {
        const oppResult = await oppResponse.json()
        setOpportunities(oppResult.opportunities || [])
        setLastOppUpdate(new Date())
      }
    } catch (e) {
      console.log('No opportunities yet')
    }
  }

  useEffect(() => {
    fetchData()
    fetchOpportunities()
    const dataInterval = setInterval(fetchData, 60000)
    const oppInterval = setInterval(fetchOpportunities, 30000)
    return () => {
      clearInterval(dataInterval)
      clearInterval(oppInterval)
    }
  }, [])

  const filteredOpportunities = opportunities.filter(opp => {
    if (filter === 'ALL') return true
    return opp.status === filter
  })

  const countByStatus = {
    GO: opportunities.filter(o => o.status === 'GO').length,
    MAYBE: opportunities.filter(o => o.status === 'MAYBE').length,
    'NO-GO': opportunities.filter(o => o.status === 'NO-GO').length,
    DETECTED: opportunities.filter(o => !o.status || o.status === 'DETECTED').length,
  }

  const theme = {
    bg: darkMode ? 'bg-slate-900' : 'bg-gray-50',
    card: darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200',
    cardInner: darkMode ? 'bg-slate-700/50' : 'bg-gray-50',
    header: darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm',
    text: darkMode ? 'text-slate-100' : 'text-gray-900',
    textMuted: darkMode ? 'text-slate-400' : 'text-gray-500',
    textAccent: darkMode ? 'text-emerald-400' : 'text-emerald-600',
    button: darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200',
    buttonActive: darkMode ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white',
    highlight: darkMode ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-200',
  }

  if (loading && !data) {
    return (
      <div className={theme.bg + ' min-h-screen flex items-center justify-center'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className={theme.textMuted}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className={theme.bg + ' min-h-screen flex items-center justify-center'}>
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Erreur: {error}</p>
          <button onClick={fetchData} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded">
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={theme.bg + ' min-h-screen ' + theme.text}>
      <header className={theme.header + ' border-b px-6 py-4'}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NA</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">NFT Alpha Platform</h1>
              <span className={'text-xs ' + theme.textMuted}>v4.0 + Claude AI + Live</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={'text-sm ' + theme.textMuted}>
              MAJ: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : 'N/A'}
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={theme.button + ' px-3 py-1.5 rounded text-sm'}
            >
              {darkMode ? '☀️ Clair' : '🌙 Sombre'}
            </button>
            <button
              onClick={() => { fetchData(); fetchOpportunities(); }}
              className={theme.button + ' px-3 py-1.5 rounded text-sm'}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard title="Collections" value={data?.collections?.length || 0} icon="📊" highlight={false} theme={theme} />
          <StatCard title="Opportunités 24h" value={data?.opportunities?.last24h || 0} icon="🎯" highlight={data?.opportunities?.last24h > 0} theme={theme} />
          <StatCard title="Analyses Claude" value={countByStatus.GO + countByStatus.MAYBE + countByStatus['NO-GO']} icon="🧠" highlight={false} theme={theme} />
          <StatCard title="Transactions Whales" value={data?.whales?.totalTransactions || 0} icon="🐋" highlight={false} theme={theme} />
          <StatCard title="Total Opportunités" value={data?.opportunities?.total || 0} icon="🔔" highlight={false} theme={theme} />
        </div>

        <div className={theme.card + ' rounded-lg p-6 border mb-6'}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              🧠 Opportunités en Temps Réel
              <span className="flex items-center gap-1 ml-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className={'text-xs ' + theme.textMuted}>Live</span>
              </span>
            </h2>
            <div className={'text-xs ' + theme.textMuted}>
              MAJ: {lastOppUpdate ? lastOppUpdate.toLocaleTimeString('fr-FR') : 'N/A'}
            </div>
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            <FilterButton label={'Tous (' + opportunities.length + ')'} active={filter === 'ALL'} onClick={() => setFilter('ALL')} theme={theme} />
            <FilterButton label={'GO (' + countByStatus.GO + ')'} active={filter === 'GO'} onClick={() => setFilter('GO')} theme={theme} color="emerald" />
            <FilterButton label={'MAYBE (' + countByStatus.MAYBE + ')'} active={filter === 'MAYBE'} onClick={() => setFilter('MAYBE')} theme={theme} color="yellow" />
            <FilterButton label={'NO-GO (' + countByStatus['NO-GO'] + ')'} active={filter === 'NO-GO'} onClick={() => setFilter('NO-GO')} theme={theme} color="red" />
          </div>

          {filteredOpportunities.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredOpportunities.slice(0, 20).map((opp, idx) => (
                <OpportunityCard key={idx} opportunity={opp} theme={theme} darkMode={darkMode} />
              ))}
            </div>
          ) : (
            <div className={'text-center py-8 ' + theme.textMuted}>
              <p className="text-4xl mb-3">🧠</p>
              <p>Aucune opportunité {filter !== 'ALL' ? '"' + filter + '"' : ''} pour le moment</p>
              <p className="text-sm mt-1">Les analyses Claude apparaîtront ici automatiquement</p>
              <p className="text-xs mt-2">Refresh auto toutes les 30 secondes</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={theme.card + ' rounded-lg p-6 border'}>
            <h2 className="text-lg font-semibold mb-4">💰 Prix Plancher (15 Collections)</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data?.collections?.map((collection, idx) => (
                <FloorPriceRow key={idx} collection={collection} theme={theme} />
              ))}
              {(!data?.collections || data.collections.length === 0) && (
                <p className={theme.textMuted + ' text-center py-4'}>Aucune donnée</p>
              )}
            </div>
          </div>

          <div className={theme.card + ' rounded-lg p-6 border'}>
            <h2 className="text-lg font-semibold mb-4">🎯 Statistiques Opportunités</h2>
            <div className="space-y-3">
              <StatRow label="Total détectées" value={data?.opportunities?.total || 0} highlight={false} theme={theme} />
              <StatRow label="Dernières 24h" value={data?.opportunities?.last24h || 0} highlight={true} theme={theme} />
              <StatRow label="Derniers 7 jours" value={data?.opportunities?.last7d || 0} highlight={false} theme={theme} />
              <StatRow label="Discount moyen" value={(data?.opportunities?.avgDiscount || 0).toFixed(1) + '%'} highlight={false} theme={theme} />
              <div className={'border-t pt-3 mt-3 ' + (darkMode ? 'border-slate-700' : 'border-gray-200')}>
                <p className={'text-sm mb-2 ' + theme.textMuted}>Décisions Claude</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded text-xs font-medium">GO: {countByStatus.GO}</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs font-medium">MAYBE: {countByStatus.MAYBE}</span>
                  <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-xs font-medium">NO-GO: {countByStatus['NO-GO']}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={theme.card + ' rounded-lg p-6 border'}>
            <h2 className="text-lg font-semibold mb-4">🐋 Activité Whales</h2>
            <div className="space-y-3">
              <StatRow label="Total transactions" value={data?.whales?.totalTransactions || 0} highlight={false} theme={theme} />
              <StatRow label="Dernières 24h" value={data?.whales?.last24h || 0} highlight={true} theme={theme} />
            </div>
          </div>

          <div className={theme.card + ' rounded-lg p-6 border'}>
            <h2 className="text-lg font-semibold mb-4">⚙️ Statut Système</h2>
            <div className="space-y-3">
              <StatusRow name="Floor Tracker" status="active" cron="*/5 min" theme={theme} />
              <StatusRow name="Sniper + Claude" status="active" cron="*/2 min" theme={theme} />
              <StatusRow name="Whale Tracker" status="active" cron="*/10 min" theme={theme} />
              <StatusRow name="Dashboard API" status="active" cron="" theme={theme} />
              <StatusRow name="Claude AI" status="active" cron="" theme={theme} />
            </div>
          </div>
        </div>

        <div className={'mt-8 text-center text-sm ' + theme.textMuted}>
          Dernière mise à jour API: {data?.lastUpdate ? new Date(data.lastUpdate).toLocaleString('fr-FR') : 'N/A'}
        </div>
      </main>

      <footer className={theme.header + ' border-t px-6 py-4 mt-8'}>
        <div className={'max-w-7xl mx-auto text-center text-sm ' + theme.textMuted}>
          NFT Alpha Platform v4.0.0 — Powered by Cloudflare + Claude AI — Live Updates
        </div>
      </footer>
    </div>
  )
}

function FilterButton({ label, active, onClick, theme, color }) {
  let activeClass = theme.buttonActive
  if (color === 'emerald') activeClass = 'bg-emerald-600 text-white'
  if (color === 'yellow') activeClass = 'bg-yellow-600 text-white'
  if (color === 'red') activeClass = 'bg-red-600 text-white'
  return (
    <button onClick={onClick} className={(active ? activeClass : theme.button) + ' px-3 py-1.5 rounded text-sm transition-colors'}>
      {label}
    </button>
  )
}

function OpportunityCard({ opportunity, theme, darkMode }) {
  const statusConfig = {
    'GO': { bg: 'bg-emerald-500/20', text: 'text-emerald-500', border: 'border-emerald-500/30' },
    'MAYBE': { bg: 'bg-yellow-500/20', text: 'text-yellow-500', border: 'border-yellow-500/30' },
    'NO-GO': { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/30' },
    'DETECTED': { bg: 'bg-gray-500/20', text: 'text-gray-500', border: 'border-gray-500/30' },
  }
  const status = opportunity.status || 'DETECTED'
  const config = statusConfig[status] || statusConfig['DETECTED']
  const blurUrl = opportunity.contract_address && opportunity.token_id
    ? 'https://blur.io/asset/' + opportunity.contract_address + '/' + opportunity.token_id
    : 'https://blur.io/collection/' + (opportunity.collection_slug || '')

  return (
    <div className={theme.cardInner + ' rounded-lg p-4 border ' + (darkMode ? 'border-slate-600' : 'border-gray-200')}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{opportunity.collection_name || 'Unknown'}</span>
            <span className={theme.textMuted + ' text-sm'}>#{opportunity.token_id || '???'}</span>
          </div>
          {opportunity.rarity_rank && (
            <div className={'text-xs mt-1 ' + theme.textMuted}>
              Rang: {opportunity.rarity_rank} / {opportunity.total_supply || '?'}
              {opportunity.rarity_percent && (' (Top ' + opportunity.rarity_percent.toFixed(1) + '%)')}
            </div>
          )}
        </div>
        <span className={config.bg + ' ' + config.text + ' ' + config.border + ' px-2 py-1 rounded text-xs font-bold border'}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 text-sm mb-3">
        <div>
          <span className={theme.textMuted + ' text-xs block'}>Prix</span>
          <p className="font-mono font-bold">{parseFloat(opportunity.listed_price || opportunity.list_price || 0).toFixed(3)} ETH</p>
        </div>
        <div>
          <span className={theme.textMuted + ' text-xs block'}>Floor</span>
          <p className="font-mono">{parseFloat(opportunity.floor_price || 0).toFixed(3)} ETH</p>
        </div>
        <div>
          <span className={theme.textMuted + ' text-xs block'}>Discount</span>
          <p className={theme.textAccent + ' font-mono'}>-{parseFloat(opportunity.discount_percent || 0).toFixed(1)}%</p>
        </div>
        <div>
          <span className={theme.textMuted + ' text-xs block'}>Score</span>
          <p className={'font-mono font-bold ' + (opportunity.opportunity_score >= 70 ? 'text-emerald-500' : opportunity.opportunity_score >= 50 ? 'text-yellow-500' : 'text-red-500')}>
            {opportunity.opportunity_score || 0}/100
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className={(darkMode ? 'bg-slate-600' : 'bg-gray-200') + ' w-full rounded-full h-2'}>
          <div
            className={(opportunity.opportunity_score >= 70 ? 'bg-emerald-500' : opportunity.opportunity_score >= 50 ? 'bg-yellow-500' : 'bg-red-500') + ' h-2 rounded-full'}
            style={{ width: (opportunity.opportunity_score || 0) + '%' }}
          ></div>
        </div>
      </div>

      {opportunity.analysis && (
        <div className={(darkMode ? 'bg-slate-700' : 'bg-gray-100') + ' text-xs p-2 rounded mb-3 ' + theme.textMuted}>
          <span className="font-semibold">Claude:</span> {opportunity.analysis.substring(0, 150)}...
        </div>
      )}

      {(opportunity.target_price || opportunity.stop_loss) && (
        <div className="flex gap-4 text-xs mb-3">
          {opportunity.target_price && (
            <div><span className={theme.textMuted}>Target: </span><span className="text-emerald-500 font-mono">{opportunity.target_price} ETH</span></div>
          )}
          {opportunity.stop_loss && (
            <div><span className={theme.textMuted}>Stop: </span><span className="text-red-500 font-mono">{opportunity.stop_loss} ETH</span></div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className={'text-xs ' + theme.textMuted}>
          {opportunity.detected_at ? new Date(opportunity.detected_at).toLocaleString('fr-FR') : 'N/A'}
        </span>
        <a href={blurUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded">
          🔗 Voir sur Blur
        </a>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, highlight, theme }) {
  return (
    <div className={(highlight ? theme.highlight : theme.card) + ' rounded-lg p-4 border'}>
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span className={'text-sm ' + theme.textMuted}>{title}</span>
      </div>
      <p className={'text-2xl font-bold ' + (highlight ? theme.textAccent : '')}>
        {value}
      </p>
    </div>
  )
}

function FloorPriceRow({ collection, theme }) {
  return (
    <div className={theme.cardInner + ' flex justify-between items-center p-2 rounded'}>
      <div className="truncate flex-1">
        <span className="font-medium text-sm">{collection.name}</span>
      </div>
      <span className={theme.textAccent + ' font-mono font-bold text-sm ml-2'}>
        {parseFloat(collection.floorPrice || 0).toFixed(3)} ETH
      </span>
    </div>
  )
}

function StatRow({ label, value, highlight, theme }) {
  return (
    <div className={theme.cardInner + ' flex justify-between items-center p-3 rounded'}>
      <span>{label}</span>
      <span className={'font-mono font-bold ' + (highlight ? theme.textAccent : '')}>
        {value}
      </span>
    </div>
  )
}

function StatusRow({ name, status, cron, theme }) {
  return (
    <div className={theme.cardInner + ' flex justify-between items-center p-3 rounded'}>
      <div className="flex items-center gap-2">
        <span className={(status === 'active' ? 'bg-emerald-500' : 'bg-red-500') + ' w-2 h-2 rounded-full'}></span>
        <span className="text-sm">{name}</span>
      </div>
      {cron && <span className={theme.textMuted + ' text-xs'}>{cron}</span>}
    </div>
  )
}

export default App
