#!/bin/bash

FILE=~/tripflow-new/src/App.jsx

# Backup
cp "$FILE" "$FILE.backup_$(date +%Y%m%d_%H%M%S)"

# 1. Ajouter l'import après la ligne "import './styles/global.css';"
sed -i '' "/import '\.\/styles\/global\.css';/a\\
import { ConstruireView } from './components/Construire';
" "$FILE"

# 2. Ajouter le bouton Construire après Guide dans la sidebar
sed -i '' "s/{ id: 'guide', icon: 'map', label: 'Guide' },/{ id: 'guide', icon: 'map', label: 'Guide' },\\
          { id: 'construire', icon: 'settings', label: 'Construire' },/" "$FILE"

# 3. Ajouter la vue Construire avant les derniers </div>
# On cherche la dernière occurrence de ")}$" avant "</div>" et on ajoute après
sed -i '' '/^        {\/\* Carte \*\/}/,/^        )}$/{
  /^        )}$/a\
\
        {/* VUE CONSTRUIRE */}\
        {sidebarTab === '"'"'construire'"'"' && (\
          <ConstruireView\
            onAddFavorite={handleToggleFavorite}\
            favorites={favorites}\
          />\
        )}
}' "$FILE"

echo "✅ Patch appliqué ! Backup créé."
