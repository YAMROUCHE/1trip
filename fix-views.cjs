const fs = require('fs');
const path = '/Users/amrouche.7/tripflow-new/src/App.jsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Remplacer import Sidebar par StipplSidebar + autres imports
content = content.replace(
  "import { Sidebar } from './components/Sidebar';",
  `import { StipplSidebar } from './components/StipplSidebar';
import { BudgetView } from './components/BudgetView';
import { PackingView } from './components/PackingView';
import { DocumentsView } from './components/DocumentsView';
import { SummaryView } from './components/SummaryView';`
);

// 2. Remplacer le composant Sidebar par StipplSidebar
content = content.replace(
  /<Sidebar[\s\S]*?\/>/,
  `<StipplSidebar
        activeTab={sidebarTab}
        onTabChange={setSidebarTab}
        userName="Youssef"
      />`
);

// 3. Ajouter vue Summary après la fermeture de AccueilView
const summaryCode = `

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
      )}`;

// Trouver la fin de la vue accueil et insérer summary après
content = content.replace(
  /(\{sidebarTab === 'accueil' && \(\s*<AccueilView[\s\S]*?\/>\s*\)\})/,
  '$1' + summaryCode
);

// 4. Ajouter vues Packing et Documents après Budget
const packingDocsCode = `

      {/* VUE PACKING */}
      {sidebarTab === 'packing' && (
        <PackingView />
      )}

      {/* VUE DOCUMENTS */}
      {sidebarTab === 'documents' && (
        <DocumentsView />
      )}`;

// Trouver la fin de la vue budget et insérer après
content = content.replace(
  /(\{sidebarTab === 'budget' && \([\s\S]*?\)\}\s*\))/,
  '$1' + packingDocsCode
);

fs.writeFileSync(path, content);
console.log('✅ App.jsx modifié avec succès!');

// Vérification
const newContent = fs.readFileSync(path, 'utf8');
const matches = newContent.match(/sidebarTab === '[^']+'/g);
console.log('Vues trouvées:', matches);
