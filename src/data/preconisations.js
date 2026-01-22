// Préconisations par destination
// Basées sur les guides Lonely Planet et recommandations famille avec enfant

export const PRECONISATIONS = {
  // Philippines
  'el-nido': {
    nights: 5,
    minNights: 4,
    maxNights: 7,
    avgBudgetPerDay: 100,
    tips: "4-5 jours idéaux pour les island hopping tours A, B, C et profiter des plages. Réservez les tours à l'avance en haute saison.",
    mustDo: ['Island Hopping Tour A', 'Nacpan Beach', 'Kayak Big Lagoon'],
    familyTips: "Les tours en bateau sont adaptés aux enfants mais prévoir des gilets. Plages calmes à Corong-Corong.",
    bestTime: "Janvier à Mai (saison sèche)",
    accommodation: {
      budget: { min: 30, max: 50, suggestion: "Guesthouses à Corong-Corong" },
      midRange: { min: 60, max: 100, suggestion: "One El Nido Suite, Spin Designer Hostel" },
      luxury: { min: 150, max: 300, suggestion: "El Nido Resorts Lagen Island" }
    }
  },

  'port-barton': {
    nights: 3,
    minNights: 2,
    maxNights: 4,
    avgBudgetPerDay: 60,
    tips: "Village tranquille, parfait pour se reposer entre El Nido et Puerto Princesa. Moins touristique.",
    mustDo: ['Island Hopping', 'Snorkeling', 'Coucher de soleil sur la plage'],
    familyTips: "Très calme et sécurisé pour les enfants. Plage peu profonde idéale.",
    bestTime: "Toute l'année",
    accommodation: {
      budget: { min: 20, max: 35, suggestion: "Bamboo houses locales" },
      midRange: { min: 40, max: 70, suggestion: "Gilian Beach Front, Ausan Beach Front" },
      luxury: { min: 80, max: 120, suggestion: "Secret Paradise Resort" }
    }
  },

  'bohol': {
    nights: 5,
    minNights: 3,
    maxNights: 6,
    avgBudgetPerDay: 80,
    tips: "Base à Panglao pour les plages, excursion d'une journée pour Chocolate Hills et tarsiers.",
    mustDo: ['Chocolate Hills', 'Tarsier Sanctuary', 'Alona Beach', 'Loboc River Cruise'],
    familyTips: "Les tarsiers fascinent les enfants (mais silence obligatoire). Croisière sur la rivière Loboc très appréciée.",
    bestTime: "Décembre à Mai",
    accommodation: {
      budget: { min: 25, max: 45, suggestion: "Alona Beach guesthouses" },
      midRange: { min: 50, max: 90, suggestion: "Alona Beach Resort, Henann Resort" },
      luxury: { min: 120, max: 250, suggestion: "Amorita Resort, South Palms Resort" }
    }
  },

  'moalboal': {
    nights: 5,
    minNights: 4,
    maxNights: 7,
    avgBudgetPerDay: 70,
    tips: "Paradis du snorkeling avec sardine run et tortues accessibles depuis la plage.",
    mustDo: ['Sardine Run', 'Turtle watching', 'Kawasan Falls', 'Pescador Island'],
    familyTips: "Snorkeling facile depuis la plage - parfait pour initier les enfants. Kawasan Falls avec canyoning light possible.",
    bestTime: "Novembre à Mai",
    accommodation: {
      budget: { min: 20, max: 40, suggestion: "Panagsama Beach guesthouses" },
      midRange: { min: 45, max: 75, suggestion: "Panagsama Stay, Quo Vadis" },
      luxury: { min: 100, max: 180, suggestion: "Ocean Bay Beach Resort" }
    }
  },

  // Thaïlande
  'bangkok': {
    nights: 4,
    minNights: 3,
    maxNights: 5,
    avgBudgetPerDay: 70,
    tips: "3-4 jours suffisent pour les temples principaux, marchés et vie nocturne. Utilisez le BTS/MRT.",
    mustDo: ['Grand Palace', 'Wat Pho', 'Chatuchak Market', 'Khao San Road'],
    familyTips: "Visites temples le matin (fraîcheur), après-midi dans les malls climatisés ou piscine hôtel.",
    bestTime: "Novembre à Février",
    accommodation: {
      budget: { min: 20, max: 40, suggestion: "Khao San Road area" },
      midRange: { min: 50, max: 80, suggestion: "Ibis Sukhumvit, Novotel Siam" },
      luxury: { min: 100, max: 200, suggestion: "Shangri-La, Mandarin Oriental" }
    }
  },

  'chiang-mai': {
    nights: 6,
    minNights: 5,
    maxNights: 8,
    avgBudgetPerDay: 60,
    tips: "Ville culturelle + nature. Prévoir 2 jours pour les temples, 1-2 pour excursions nature.",
    mustDo: ['Doi Suthep', 'Old City temples', 'Elephant Nature Park', 'Night Bazaar', 'Sunday Walking Street'],
    familyTips: "Elephant Nature Park éthique et éducatif. Cours de cuisine thaï pour enfants disponibles.",
    bestTime: "Novembre à Février",
    accommodation: {
      budget: { min: 15, max: 35, suggestion: "Guesthouses Old City" },
      midRange: { min: 50, max: 100, suggestion: "Rachamankha, De Naga" },
      luxury: { min: 120, max: 250, suggestion: "Four Seasons, Dhara Dhevi" }
    }
  },

  'koh-lanta': {
    nights: 7,
    minNights: 5,
    maxNights: 10,
    avgBudgetPerDay: 80,
    tips: "Île familiale par excellence. Plus calme que Phuket/Koh Samui. Location scooter recommandée.",
    mustDo: ['Long Beach', 'Koh Rok snorkeling', 'Old Town', 'Mu Ko Lanta National Park', 'Kayak mangroves'],
    familyTips: "Plages sécurisées, vagues calmes. Beaucoup de resorts familiaux avec kids clubs.",
    bestTime: "Novembre à Avril",
    accommodation: {
      budget: { min: 25, max: 50, suggestion: "Bungalows Long Beach sud" },
      midRange: { min: 60, max: 100, suggestion: "Lanta Casa Blanca, Twin Lotus" },
      luxury: { min: 150, max: 300, suggestion: "Pimalai Resort, Layana Resort" }
    }
  },

  // Vietnam
  'hoi-an': {
    nights: 4,
    minNights: 3,
    maxNights: 5,
    avgBudgetPerDay: 50,
    tips: "Ville piétonne charmante. 2 jours centre historique + 1-2 jours excursions (My Son, plage).",
    mustDo: ['Ancient Town', 'Lantern making', 'Cooking class', 'An Bang Beach', 'Boat ride Thu Bon'],
    familyTips: "Atelier lanternes très apprécié des enfants. Balade en vélo sécurisée dans les rizières.",
    bestTime: "Février à Mai",
    accommodation: {
      budget: { min: 15, max: 30, suggestion: "Homestays" },
      midRange: { min: 35, max: 70, suggestion: "Vinh Hung Heritage, Hoi An Silk Village" },
      luxury: { min: 100, max: 200, suggestion: "Four Seasons Nam Hai, Victoria Hoi An" }
    }
  },

  'ninh-binh': {
    nights: 2,
    minNights: 2,
    maxNights: 3,
    avgBudgetPerDay: 45,
    tips: "Baie d'Halong terrestre. 2 jours suffisent pour Tam Coc et Trang An.",
    mustDo: ['Tam Coc boat ride', 'Trang An', 'Mua Cave viewpoint', 'Bich Dong Pagoda'],
    familyTips: "Balade en barque très appréciée des enfants. Montée Mua Cave possible avec enfant > 5 ans.",
    bestTime: "Février à Avril, Septembre à Novembre",
    accommodation: {
      budget: { min: 15, max: 30, suggestion: "Homestays Tam Coc" },
      midRange: { min: 40, max: 80, suggestion: "Tam Coc Garden, Ninh Binh Hidden Charm" },
      luxury: { min: 100, max: 180, suggestion: "Ninh Binh Legend Hotel" }
    }
  },

  'hanoi': {
    nights: 3,
    minNights: 2,
    maxNights: 4,
    avgBudgetPerDay: 50,
    tips: "Vieille ville + lac Hoan Kiem. Point de départ pour Halong Bay (optionnel).",
    mustDo: ['Old Quarter', 'Hoan Kiem Lake', 'Water Puppets', 'Temple of Literature', 'Street food tour'],
    familyTips: "Spectacle marionnettes sur l'eau incontournable avec enfants. Cyclo-pousse amusant.",
    bestTime: "Octobre à Décembre, Mars à Avril",
    accommodation: {
      budget: { min: 15, max: 30, suggestion: "Old Quarter hostels" },
      midRange: { min: 40, max: 70, suggestion: "Essence Hanoi, Silk Path" },
      luxury: { min: 100, max: 200, suggestion: "Sofitel Legend Metropole" }
    }
  },

  // Bali
  'ubud': {
    nights: 8,
    minNights: 5,
    maxNights: 10,
    avgBudgetPerDay: 70,
    tips: "Cœur culturel de Bali. Rizières, temples, artisanat. Base idéale pour explorer.",
    mustDo: ['Tegallalang Rice Terrace', 'Monkey Forest', 'Tirta Empul', 'Yoga class', 'Cooking class'],
    familyTips: "Monkey Forest fascinant mais attention aux singes ! Ateliers batik pour enfants.",
    bestTime: "Avril à Octobre",
    accommodation: {
      budget: { min: 20, max: 40, suggestion: "Guesthouses Jalan Kajeng" },
      midRange: { min: 50, max: 100, suggestion: "Alam Jiwa, Bisma Eight" },
      luxury: { min: 150, max: 400, suggestion: "Four Seasons Sayan, Viceroy" }
    }
  },

  'sanur': {
    nights: 5,
    minNights: 4,
    maxNights: 7,
    avgBudgetPerDay: 65,
    tips: "Station balnéaire tranquille, très familiale. Bon point de départ pour Nusa Penida.",
    mustDo: ['Beach walk', 'Sunrise', 'Le Mayeur Museum', 'Night market', 'Snorkeling'],
    familyTips: "Plage la plus adaptée aux enfants à Bali - eau calme, peu profonde. Piste cyclable agréable.",
    bestTime: "Avril à Octobre",
    accommodation: {
      budget: { min: 25, max: 45, suggestion: "Guesthouses centre" },
      midRange: { min: 50, max: 90, suggestion: "Segara Village, Prime Plaza" },
      luxury: { min: 120, max: 250, suggestion: "Hyatt Regency, Tandjung Sari" }
    }
  },

  'nusa-penida': {
    nights: 3,
    minNights: 2,
    maxNights: 4,
    avgBudgetPerDay: 60,
    tips: "Île sauvage, routes difficiles. Prévoir guide/chauffeur. Paysages spectaculaires.",
    mustDo: ['Kelingking Beach', 'Broken Beach', 'Angel Billabong', 'Manta Point snorkeling'],
    familyTips: "Routes difficiles, déconseillé avec très jeunes enfants. À partir de 6 ans OK avec précautions.",
    bestTime: "Avril à Novembre",
    accommodation: {
      budget: { min: 20, max: 40, suggestion: "Bungalows Crystal Bay" },
      midRange: { min: 45, max: 80, suggestion: "La Rip Bungalows, Semabu Hills" },
      luxury: { min: 100, max: 200, suggestion: "Adiwana Warnakali" }
    }
  },

  'canggu': {
    nights: 10,
    minNights: 7,
    maxNights: 14,
    avgBudgetPerDay: 75,
    tips: "Ambiance surf/digital nomad. Bon compromis plage/restaurants/vie nocturne.",
    mustDo: ['Tanah Lot sunset', 'Echo Beach surf', 'Beach clubs (Finns, La Brisa)', 'Rice field walk'],
    familyTips: "Finns Recreation Club parfait pour familles (piscines, bowling). Attention aux vagues pour baignade.",
    bestTime: "Avril à Octobre",
    accommodation: {
      budget: { min: 25, max: 50, suggestion: "Guesthouses Berawa" },
      midRange: { min: 60, max: 110, suggestion: "Theanna Eco Villa, FRii Bali Echo Beach" },
      luxury: { min: 150, max: 350, suggestion: "Como Uma Canggu, Hotel Tugu" }
    }
  }
};

// Fonction utilitaire pour obtenir la préconisation
export function getPreconisation(destinationId) {
  return PRECONISATIONS[destinationId] || null;
}

// Suggestions de durée totale par pays
export const COUNTRY_SUGGESTIONS = {
  philippines: {
    minDays: 14,
    idealDays: 20,
    maxDays: 30,
    tips: "Prévoir du temps pour les transferts inter-îles (ferries, vols domestiques)."
  },
  thailande: {
    minDays: 14,
    idealDays: 20,
    maxDays: 30,
    tips: "Mix ville (Bangkok) + culture (Chiang Mai) + plage (îles sud) recommandé."
  },
  vietnam: {
    minDays: 10,
    idealDays: 14,
    maxDays: 21,
    tips: "Pays tout en longueur - prévoir vols intérieurs pour optimiser le temps."
  },
  bali: {
    minDays: 14,
    idealDays: 21,
    maxDays: 35,
    tips: "Une seule île mais très diverse. Alterner zones touristiques et calmes."
  }
};
