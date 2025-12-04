// Script de génération de 80 annonces réalistes pour Appyna
// Date: 3 décembre 2025

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Lire les variables d'environnement depuis .env.local
const envFile = readFileSync('.env.local', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 4 User IDs
const USER_IDS = [
  '189251a6-beb3-4641-a3db-126d3132a1da',
  '5b9bed83-5e24-4cef-9cb7-a58719afb4c7',
  '992776de-0cb6-4ad4-8608-870e9c95e2b2',
  'b8b7c8c8-faf3-4aff-91a5-0d3cda969524'
];

// 5 villes
const CITIES = ['Tel Aviv', 'Jérusalem', 'Haifa', 'Netanya', 'Ashdod'];

// Configuration des catégories (total: 80)
const CATEGORIES_CONFIG = {
  immobilier: 15,
  emploi: 15,
  vetements: 15,
  maison: 20,
  services: 15
};

// 50 offres + 30 demandes
const LISTING_TYPES = {
  offer: 50,
  request: 30
};

// Templates d'annonces par catégorie
const LISTINGS_TEMPLATES = {
  immobilier: {
    offers: [
      { title: "Appartement 3 pièces à louer", description: "Magnifique appartement lumineux de 75m² au cœur de {city}. 2 chambres, salon spacieux, cuisine équipée, balcon avec vue. Proche de toutes commodités. Disponible immédiatement.", price: 4500 },
      { title: "Studio meublé centre-ville", description: "Charmant studio de 35m² entièrement meublé et équipé à {city}. Idéal pour étudiant ou jeune actif. Charges comprises. Parking disponible.", price: 2800 },
      { title: "Villa avec jardin à vendre", description: "Superbe villa de 180m² avec jardin de 200m² à {city}. 4 chambres, 2 salles de bain, grande terrasse. Quartier calme et résidentiel.", price: 2500000 },
      { title: "Colocation chambre disponible", description: "Chambre meublée dans appartement partagé à {city}. Ambiance conviviale, proche transports. Toutes charges incluses. Disponible le 1er du mois.", price: 1800 },
      { title: "Bureau professionnel à louer", description: "Espace de bureau moderne de 45m² à {city}. Climatisation, internet haut débit, parking. Idéal pour profession libérale ou startup.", price: 3200 }
    ],
    requests: [
      { title: "Recherche appartement 2-3 pièces", description: "Couple français recherche appartement de 60-80m² à {city}. Budget max 5000 ILS/mois. Secteur calme souhaité. Disponibilité immédiate.", price: 5000 },
      { title: "Cherche colocation sur Tel Aviv", description: "Jeune professionnelle cherche colocation sympa à {city}. Budget 2000 ILS max. Non-fumeur, propre et respectueux.", price: 2000 },
      { title: "Famille cherche maison avec jardin", description: "Famille avec 2 enfants cherche maison ou grande villa à {city}. Minimum 3 chambres. Jardin obligatoire. Budget flexible.", price: 7000 }
    ]
  },
  
  emploi: {
    offers: [
      { title: "Recherche développeur web React", description: "Startup en croissance à {city} recrute développeur React/Node.js expérimenté. Minimum 2 ans d'expérience. Télétravail partiel possible. Package attractif.", price: 18000 },
      { title: "Professeur de français recherché", description: "École internationale à {city} cherche professeur de français natif. Classes de tous niveaux. CDI 30h/semaine. Expérience pédagogique souhaitée.", price: 12000 },
      { title: "Serveur/Serveuse restaurant français", description: "Restaurant gastronomique à {city} recrute serveur/serveuse francophone. Expérience en restauration demandée. Ambiance familiale et pourboires généreux.", price: 8000 },
      { title: "Graphiste freelance missions régulières", description: "Agence de communication à {city} cherche graphiste freelance pour missions régulières. Maîtrise Adobe Suite obligatoire. Portfolio à fournir.", price: 150 },
      { title: "Baby-sitter francophone", description: "Famille française à {city} cherche baby-sitter francophone pour 3 enfants (2, 5, 8 ans). 20h/semaine. Expérience avec enfants requise.", price: 60 }
    ],
    requests: [
      { title: "Cherche emploi comptabilité", description: "Comptable diplômé avec 5 ans d'expérience cherche poste à {city}. Maîtrise logiciels comptables et bilingue FR/HE. Disponible immédiatement.", price: 15000 },
      { title: "Recherche stage marketing digital", description: "Étudiant en Master Marketing cherche stage 6 mois à {city}. Compétences SEO, réseaux sociaux, Google Ads. Motivé et créatif.", price: 5000 },
      { title: "Chef cuisinier cherche restaurant", description: "Chef cuisinier français avec 10 ans d'expérience cherche poste à {city}. Spécialités françaises et méditerranéennes. Références disponibles.", price: 16000 }
    ]
  },
  
  vetements: {
    offers: [
      { title: "Robe de soirée Zara taille M", description: "Magnifique robe de soirée Zara portée une seule fois. Taille M, couleur bleu nuit. Parfait état. Achetée 450 ILS. À récupérer à {city}.", price: 180 },
      { title: "Costume homme Hugo Boss", description: "Costume 2 pièces Hugo Boss taille 50, gris anthracite. Excellent état, nettoyage pressing. Idéal mariage ou événement. {city}.", price: 800 },
      { title: "Lot vêtements bébé 0-6 mois", description: "Lot de 25 pièces (bodies, pyjamas, robes) pour bébé fille 0-6 mois. Marques diverses, excellent état. {city}.", price: 200 },
      { title: "Chaussures Nike Air Max 42", description: "Paire de Nike Air Max taille 42 portées 3 fois. État neuf, boîte d'origine. Modèle très recherché. Remise en main propre {city}.", price: 350 },
      { title: "Manteau d'hiver femme The North Face", description: "Manteau The North Face taille S, noir, très chaud. Parfait pour l'hiver israélien en montagne. Comme neuf. {city}.", price: 450 }
    ],
    requests: [
      { title: "Recherche robe de mariée taille 38", description: "Future mariée cherche robe de mariée taille 38. Style romantique ou bohème. Budget max 2000 ILS. Mariage prévu en juin. {city}.", price: 2000 },
      { title: "Cherche vêtements garçon 4-5 ans", description: "Maman cherche vêtements pour garçon de 4-5 ans. Toutes saisons. Bon état souhaité. Budget flexible. {city}.", price: 300 },
      { title: "Recherche costume homme mariage", description: "Homme taille 48 cherche costume élégant pour mariage. Couleur sobre. Location ou achat. Budget 1000 ILS max. {city}.", price: 1000 }
    ]
  },
  
  maison: {
    offers: [
      { title: "Canapé 3 places beige", description: "Canapé 3 places très confortable en tissu beige. Excellent état, non fumeur, pas d'animaux. L 210cm. À venir chercher à {city}.", price: 1500 },
      { title: "Table à manger + 6 chaises", description: "Belle table en bois massif avec 6 chaises assorties. Parfait état. Idéal pour famille. Dimensions: 180x90cm. {city}.", price: 2200 },
      { title: "Lit double avec matelas", description: "Lit double (160x200) avec sommier et matelas Ikea récent (1 an). Très bon état. Possibilité de livraison sur {city}.", price: 900 },
      { title: "Réfrigérateur Samsung 400L", description: "Réfrigérateur Samsung 400L, 2 ans, parfait état de marche. Classe énergétique A++. Cause déménagement. {city}.", price: 1800 },
      { title: "Miroir mural design 120x80", description: "Grand miroir mural design avec cadre doré. Dimensions 120x80cm. État neuf, acheté chez Zara Home. {city}.", price: 350 },
      { title: "Lampadaire arc moderne", description: "Lampadaire arc design moderne, hauteur ajustable. Pied en marbre, bras chromé. Parfait pour salon contemporain. {city}.", price: 480 },
      { title: "Ensemble vaisselle 24 pièces", description: "Service de vaisselle complet Ikea pour 6 personnes. Porcelaine blanche. Jamais servi, encore dans cartons. {city}.", price: 280 }
    ],
    requests: [
      { title: "Recherche lit enfant avec tiroirs", description: "Cherche lit enfant (90x190) avec tiroirs de rangement. Bon état souhaité. Budget max 800 ILS. {city}.", price: 800 },
      { title: "Cherche meubles complets appartement", description: "Jeune couple emménage à {city}, cherche meubles complets : salon, chambre, cuisine. Budget 10000 ILS. Lot complet souhaité.", price: 10000 },
      { title: "Recherche canapé-lit confortable", description: "Cherche canapé convertible en bon état pour studio. Budget max 2000 ILS. Mécanisme facile et matelas confortable. {city}.", price: 2000 }
    ]
  },
  
  services: {
    offers: [
      { title: "Cours de français tous niveaux", description: "Professeure diplômée donne cours de français à {city}. Tous niveaux, conversation, préparation examens. À domicile ou en ligne. Expérience 10 ans.", price: 120 },
      { title: "Plombier professionnel", description: "Plombier qualifié intervient à {city} et environs. Dépannage urgence, installation, rénovation. Devis gratuit. Disponible 7j/7.", price: 200 },
      { title: "Aide ménagère sérieuse", description: "Dame sérieuse et expérimentée propose services ménage/repassage à {city}. Références disponibles. Produits fournis. Paiement facture.", price: 60 },
      { title: "Déménagement petit volume", description: "Service de déménagement pour petits volumes à {city}. Van équipé, aide au portage. Tarif à l'heure. Disponible week-ends.", price: 150 },
      { title: "Photographe événements", description: "Photographe professionnel pour mariages, bar-mitsva, événements familiaux à {city}. Portfolio sur demande. Retouches incluses.", price: 2500 }
    ],
    requests: [
      { title: "Cherche électricien urgent", description: "Problème électrique urgent à résoudre à {city}. Plusieurs prises qui ne fonctionnent plus. Intervention rapide souhaitée.", price: 300 },
      { title: "Recherche coach sportif personnel", description: "Cherche coach sportif pour remise en forme à {city}. 2-3 séances/semaine. Programme personnalisé. Diplômé souhaité.", price: 200 },
      { title: "Cherche traducteur FR-HE professionnel", description: "Besoin traducteur professionnel français-hébreu pour documents officiels. Traduction assermentée. Urgent. {city}.", price: 500 }
    ]
  }
};

// Fonction pour générer une date aléatoire entre octobre et novembre 2025
function randomDate() {
  const start = new Date(2025, 9, 1); // 1er octobre 2025
  const end = new Date(2025, 11, 1); // 1er décembre 2025
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  
  // Heure aléatoire entre 8h et 23h
  const hour = 8 + Math.floor(Math.random() * 16); // 8-23h
  const minute = Math.floor(Math.random() * 60);
  
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

// Fonction pour sélectionner une ville aléatoire
function randomCity() {
  return CITIES[Math.floor(Math.random() * CITIES.length)];
}

// Fonction pour générer les annonces
function generateListings() {
  const listings = [];
  let offerCount = 0;
  let requestCount = 0;
  
  const categoriesArray = [
    { category: 'immobilier', count: CATEGORIES_CONFIG.immobilier },
    { category: 'emploi', count: CATEGORIES_CONFIG.emploi },
    { category: 'vetements', count: CATEGORIES_CONFIG.vetements },
    { category: 'maison', count: CATEGORIES_CONFIG.maison },
    { category: 'services', count: CATEGORIES_CONFIG.services }
  ];
  
  // Pour chaque catégorie
  categoriesArray.forEach(({ category, count }) => {
    const templates = LISTINGS_TEMPLATES[category];
    
    for (let i = 0; i < count; i++) {
      // Décider si c'est une offre ou une demande
      const isOffer = offerCount < LISTING_TYPES.offer && 
                      (requestCount >= LISTING_TYPES.request || Math.random() > 0.375);
      
      const type = isOffer ? 'offer' : 'request';
      const typeTemplates = templates[type + 's'];
      
      // Sélectionner un template aléatoire
      const template = typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
      const city = randomCity();
      
      // Créer l'annonce
      const listing = {
        user_id: USER_IDS[i % 4], // Distribution équitable entre les 4 users
        title: template.title,
        description: template.description.replace('{city}', city),
        category: category,
        type: type,
        price: template.price,
        city: city,
        created_at: randomDate()
      };
      
      listings.push(listing);
      
      if (isOffer) offerCount++;
      else requestCount++;
    }
  });
  
  // Mélanger les annonces pour plus de réalisme
  return listings.sort(() => Math.random() - 0.5);
}

// Fonction pour échapper les quotes SQL
function escapeSql(str) {
  return str.replace(/'/g, "''");
}

// Fonction principale
async function main() {
  console.log('🚀 Génération de 80 annonces pour Appyna...\n');
  
  const listings = generateListings();
  
  console.log('📊 Statistiques:');
  console.log(`- Total annonces: ${listings.length}`);
  console.log(`- Offres: ${listings.filter(l => l.type === 'offer').length}`);
  console.log(`- Demandes: ${listings.filter(l => l.type === 'request').length}`);
  
  const categoryCounts = {};
  listings.forEach(l => {
    categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
  });
  console.log('\n📁 Par catégorie:');
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(`- ${cat}: ${count} annonces`);
  });
  
  const userCounts = {};
  listings.forEach(l => {
    const userIndex = USER_IDS.indexOf(l.user_id) + 1;
    userCounts[`User ${userIndex}`] = (userCounts[`User ${userIndex}`] || 0) + 1;
  });
  console.log('\n👥 Par utilisateur:');
  Object.entries(userCounts).forEach(([user, count]) => {
    console.log(`- ${user}: ${count} annonces`);
  });
  
  console.log('\n📝 Génération du fichier SQL...');
  
  // Générer le SQL
  let sql = `-- Script SQL pour insérer 80 annonces
-- Généré automatiquement le ${new Date().toLocaleString('fr-FR')}
-- À exécuter dans Supabase SQL Editor

-- Désactiver temporairement RLS
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;

-- Insérer les 80 annonces
`;
  
  listings.forEach(listing => {
    sql += `INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('${listing.user_id}', '${escapeSql(listing.title)}', '${escapeSql(listing.description)}', '${listing.category}', '${listing.type}', ${listing.price}, '${escapeSql(listing.city)}', '${listing.created_at}');\n\n`;
  });
  
  sql += `-- Réactiver RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Vérification
SELECT COUNT(*) as total_listings FROM listings;
SELECT category, COUNT(*) as count FROM listings GROUP BY category ORDER BY category;
SELECT type, COUNT(*) as count FROM listings GROUP BY type;
`;
  
  // Écrire le fichier SQL
  import('fs').then(fs => {
    fs.writeFileSync('insert-listings.sql', sql, 'utf-8');
    console.log('✅ Fichier insert-listings.sql créé avec succès !');
    console.log('\n📋 Prochaine étape:');
    console.log('1. Ouvre Supabase Dashboard → SQL Editor');
    console.log('2. Copie-colle le contenu de insert-listings.sql');
    console.log('3. Clique sur "Run"');
    console.log('\n🎉 Les 80 annonces seront créées instantanément !');
  });
}

// Exécution
main().catch(console.error);
