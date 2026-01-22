const fs = require('fs');

let content = fs.readFileSync('/Users/amrouche.7/tripflow-new/src/App.jsx', 'utf8');

// 1. Remplacer l'import Sidebar par StipplSidebar
content = content.replace(
  "import { Sidebar } from './components/Sidebar';",
  `import { StipplSidebar } from './components/StipplSidebar';
import { BudgetView } from './components/BudgetView';
import { PackingView } from './components/PackingView';
import { DocumentsView } from './components/DocumentsView';
import { SummaryView } from './components/SummaryView';`
);

// 2. Remplacer <Sidebar par <StipplSidebar avec bonnes props
content = content.replace(
  /<Sidebar\s+isOpen=\{sidebarOpen\}\s+onToggle=\{[^}]+\}\s+activeTab=\{sidebarTab\}\s+onTabChange=\{setSidebarTab\}\s+\/>/s,
  `<StipplSidebar
        activeTab={sidebarTab}
        onTabChange={setSidebarTab}
        userName="Youssef"
      />`
);

// 3. Ajouter les vues summary, packing, documents après accueil
const summaryView = `
      {/* VUE SUMMARY */}
      {sidebarTab === 'summary' && (
        <SummaryView
          tripName="Asie du Sud-Est 2026"
          totalNights={totalNights}
          totalCost={totalCost}
          budget={TRIP_CONFIG.budget}
          destinations={destinations}
          totalPOI={totalPOI}
          favorites={favorites}
          onNavigate={setSidebarTab}
        />
      )}
`;

const packingView = `
      {/* VUE PACKING */}
      {sidebarTab === 'packing' && (
        <PackingView />
      )}
`;

const documentsView = `
      {/* VUE DOCUMENTS */}
      {sidebarTab === 'documents' && (
        <DocumentsView />
      )}
`;

// Insérer après la vue accueil
content = content.replace(
  /(\{sidebarTab === 'accueil' && \([\s\S]*?\)\}\s*\))/,
  `$1${summaryView}`
);

// Insérer après la vue budget
content = content.replace(
  /(\{sidebarTab === 'budget' && \([\s\S]*?\)\}\s*\))/,
  `$1${packingView}${documentsView}`
);

fs.writeFileSync('/Users/amrouche.7/tripflow-new/src/App.jsx', content);
console.log('✅ App.jsx modifié avec succès!');
