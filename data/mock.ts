import { v4 as uuidv4 } from 'uuid';
import { Listing, User, Conversation, Message, Category, ListingType, CITIES_ISRAEL } from '../types';

// Mock users
const user1Id = uuidv4();
const user2Id = uuidv4();
const user3Id = uuidv4();

export const mockUsers: User[] = [
  {
    id: user1Id,
    name: 'Marie Dubois',
    email: 'marie@email.com',
    bio: "Passionnée de décoration et de trouvailles vintage. Je vends ce que je n'utilise plus pour faire de la place pour de nouvelles pépites !",
    avatarUrl: `https://i.pravatar.cc/150?u=${user1Id}`,
    favorites: [],
  },
  {
    id: user2Id,
    name: 'Julien Lefebvre',
    email: 'julien@email.com',
    bio: 'Développeur et amateur de high-tech. Je mets en vente du matériel informatique en excellent état.',
    avatarUrl: `https://i.pravatar.cc/150?u=${user2Id}`,
    favorites: [],
  },
  {
    id: user3Id,
    name: 'Sophie Cohen',
    email: 'sophie@email.com',
    bio: 'Jeune maman, je propose des services de babysitting et vends des articles pour enfants.',
    avatarUrl: `https://i.pravatar.cc/150?u=${user3Id}`,
    favorites: [],
  },
];

const listing1Id = uuidv4();
const listing2Id = uuidv4();
const listing3Id = uuidv4();
const listing4Id = uuidv4();

export const mockListings: Listing[] = [
  {
    id: listing1Id,
    userId: user1Id,
    title: "Superbe canapé d'angle convertible",
    description:
      "Vends canapé d'angle convertible en tissu gris, très confortable. Acheté il y a 2 ans, en excellent état. Non-fumeur, pas d'animaux.\nDimensions: 240x160cm.\nÀ venir chercher sur place.",
    price: 1500,
    category: Category.OBJECTS,
    city: CITIES_ISRAEL[1], // Tel Aviv
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
    type: ListingType.OFFER,
    isBoosted: true,
    boostedAt: new Date(new Date().setHours(new Date().getHours() - 12)), // Boosté il y a 12h
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: listing2Id,
    userId: user2Id,
    title: 'MacBook Pro 16" 2021 M1 Pro',
    description:
      "Vends MacBook Pro 16 pouces, puce M1 Pro, 16Go RAM, 512Go SSD. Couleur Gris Sidéral. État comme neuf, avec boîte et chargeur d'origine. Idéal pour montage vidéo et développement.",
    price: 7000,
    category: Category.OBJECTS,
    city: CITIES_ISRAEL[0], // Jérusalem
    imageUrl:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop',
    type: ListingType.OFFER,
    isBoosted: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
  {
    id: uuidv4(),
    userId: user3Id,
    title: 'Recherche appartement 3 pièces à Raanana',
    description:
      "Jeune couple avec un enfant cherche un appartement 3 pièces lumineux avec balcon à Raanana. Proche des parcs et des écoles. Budget flexible. Étudions toutes propositions.",
    // price: undefined, // DEMAND sans prix - sera affiché "Aucun prix"
    category: Category.IMMOBILIER,
    city: CITIES_ISRAEL[16], // Raanana
    imageUrl:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop',
    type: ListingType.DEMAND,
    isBoosted: true,
    boostedAt: new Date(new Date().setHours(new Date().getHours() - 2)), // Boosté il y a 2h (plus récent)
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: listing3Id,
    userId: user1Id,
    title: 'Cours de poterie pour débutants',
    description:
      "Artiste potière, je propose des cours d'initiation à la poterie (tournage et modelage) dans mon atelier à Haïfa. Cours individuels ou en petit groupe. Matériel fourni. Ambiance conviviale garantie !",
    price: 250,
    category: Category.SERVICES,
    city: CITIES_ISRAEL[2], // Haïfa
    imageUrl:
      'https://images.unsplash.com/photo-1557954249-1e3c1a58c8a1?q=80&w=1974&auto=format&fit=crop',
    type: ListingType.OFFER,
    isBoosted: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
  },
  {
    id: listing4Id,
    userId: user2Id,
    title: 'Peugeot 208 Année 2019',
    description:
      'Vends Peugeot 208, année 2019, 65 000 km. Essence, boîte manuelle. Très bon état général, contrôle technique OK. Idéale pour jeune conducteur.',
    price: 45000,
    category: Category.VEHICULES,
    city: CITIES_ISRAEL[5], // Ashdod
    imageUrl:
      'https://images.unsplash.com/photo-1616422285855-ab0192a58b18?q=80&w=2070&auto=format&fit=crop',
    type: ListingType.OFFER,
    isBoosted: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 8)),
  },
  {
    id: uuidv4(),
    userId: user2Id,
    title: 'Drone DJI Mini 3 Pro (comme neuf)',
    description:
      "Vends drone DJI Mini 3 Pro avec le pack Fly More. Très peu utilisé, aucune trace d'usure. Idéal pour les voyages, pèse moins de 250g. Qualité d'image incroyable.",
    price: 3200,
    category: Category.OBJECTS,
    city: CITIES_ISRAEL[14], // Herzliya
    imageUrl:
      'https://images.unsplash.com/photo-1678853242092-233956f8b375?q=80&w=2070&auto=format&fit=crop',
    type: ListingType.OFFER,
    isBoosted: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: uuidv4(),
    userId: user3Id,
    title: 'Appartement 4 pièces à louer, Neve Tzedek',
    description:
      'Magnifique 4 pièces rénové dans le quartier prisé de Neve Tzedek à Tel Aviv. Lumineux, calme, avec une grande terrasse. Disponible immédiatement. Visites sur demande.',
    price: 9500,
    category: Category.IMMOBILIER,
    city: CITIES_ISRAEL[1], // Tel Aviv
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    type: ListingType.OFFER,
    isBoosted: true,
    boostedAt: new Date(new Date().setHours(new Date().getHours() - 6)), // Boosté il y a 6h
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: uuidv4(),
    userId: user1Id,
    title: "Cours particuliers d'hébreu (Oulpan)",
    description:
      "Professeur expérimentée donne cours d'hébreu tous niveaux, en ligne ou en présentiel à Jérusalem. Méthode personnalisée et efficace pour progresser rapidement.",
    price: 150,
    category: Category.SERVICES,
    city: CITIES_ISRAEL[0], // Jérusalem
    imageUrl:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop',
    type: ListingType.OFFER,
    isBoosted: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
  },
  {
    id: uuidv4(),
    userId: user1Id,
    title: 'Table basse vintage en bois massif',
    description:
      'Superbe table basse en teck des années 60. Design scandinave, en excellent état. Une pièce unique pour votre salon. Dimensions: 120x50x45cm.',
    price: 800,
    category: Category.OBJECTS,
    city: CITIES_ISRAEL[2], // Haïfa
    imageUrl:
      'https://images.unsplash.com/photo-1593078356193-4a7b5311434c?q=80&w=1964&auto=format&fit=crop',
    type: ListingType.OFFER,
    isBoosted: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 20)),
  },
  {
    id: uuidv4(),
    userId: user2Id,
    title: 'Recherche baby-sitter pour soirées',
    description:
      'Nous cherchons une personne de confiance pour garder nos deux enfants (3 et 6 ans) occasionnellement en soirée et le week-end, à Petah Tikva.',
    // price: undefined, // DEMAND sans prix - sera affiché "Aucun prix"
    category: Category.SERVICES,
    city: CITIES_ISRAEL[4], // Petah Tikva
    imageUrl:
      'https://images.unsplash.com/photo-1509228505872-a136184715ab?q=80&w=2071&auto=format&fit=crop',
    type: ListingType.DEMAND,
    isBoosted: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
  },
  {
    id: uuidv4(),
    userId: user3Id,
    title: 'Vélo de route Trek Emonda SL 5',
    description:
      'Vends vélo de course Trek Emonda SL 5, cadre carbone, groupe Shimano 105. Taille 54. Très peu roulé, état impeccable. Idéal pour cyclistes exigeants.',
    price: 6500,
    category: Category.VEHICULES,
    city: CITIES_ISRAEL[6], // Netanya
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2069&auto=format&fit=crop',
    type: ListingType.OFFER,
    isBoosted: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 6)),
  },
  // Annonces d'exemple SANS images pour tester le fallback
  {
    id: uuidv4(),
    userId: user1Id,
    title: 'Service de ménage à domicile',
    description:
      'Propose services de ménage à domicile sur Tel Aviv et environs. Expérience de 5 ans, références disponibles. Tarifs compétitifs et horaires flexibles.',
    price: 80,
    category: Category.SERVICES,
    city: CITIES_ISRAEL[1], // Tel Aviv
    imageUrl: '', // Image vide pour tester le fallback
    type: ListingType.OFFER,
    isBoosted: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: uuidv4(),
    userId: user2Id,
    title: 'Recherche colocation à Jérusalem',
    description:
      'Étudiant sérieux cherche une chambre en colocation dans un appartement propre et calme à Jérusalem. Non-fumeur, budget jusqu\'à 2000₪/mois.',
    price: 0,
    category: Category.IMMOBILIER,
    city: CITIES_ISRAEL[0], // Jérusalem
    imageUrl: undefined, // Image undefined pour tester le fallback
    type: ListingType.DEMAND,
    isBoosted: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
  },
  {
    id: uuidv4(),
    userId: user3Id,
    title: 'Cours de guitare tous niveaux',
    description:
      'Guitariste professionnel propose cours particuliers de guitare classique et moderne. Méthode adaptée à chaque élève. Premier cours d\'essai offert !',
    price: 200,
    category: Category.SERVICES,
    city: CITIES_ISRAEL[2], // Haïfa
    imageUrl: 'https://image-invalide-404.jpg', // URL invalide pour tester l'erreur
    type: ListingType.OFFER,
    isBoosted: true,
    boostedAt: new Date(new Date().setHours(new Date().getHours() - 1)), // Boosté il y a 1h
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: uuidv4(),
    userId: user1Id,
    title: 'Matériel de camping complet',
    description:
      'Vends lot de matériel de camping : tente 4 places, sacs de couchage, réchaud, lanterne LED. Le tout en excellent état, utilisé seulement 2 fois.',
    price: 1200,
    category: Category.OBJECTS,
    city: CITIES_ISRAEL[5], // Ashdod
    imageUrl: null, // Image null pour tester le fallback
    type: ListingType.OFFER,
    isBoosted: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 12)),
  },
];

const conversation1Id = uuidv4();

export const mockConversations: Conversation[] = [
  {
    id: conversation1Id,
    listingId: listing1Id,
    participantIds: [user1Id, user2Id],
    messages: [
      {
        id: uuidv4(),
        senderId: user2Id,
        text: 'Bonjour, votre canapé est-il toujours disponible ?',
        createdAt: new Date(new Date().setHours(new Date().getHours() - 25)),
      },
      {
        id: uuidv4(),
        senderId: user1Id,
        text: 'Bonjour, oui il est toujours disponible.',
        createdAt: new Date(new Date().setHours(new Date().getHours() - 24)),
      },
      {
        id: uuidv4(),
        senderId: user2Id,
        text: 'Super ! Serait-il possible de venir le voir ce week-end ?',
        createdAt: new Date(new Date().setHours(new Date().getHours() - 23)),
      },
    ],
  },
  {
    id: uuidv4(),
    listingId: listing2Id,
    participantIds: [user2Id, user3Id],
    messages: [
      {
        id: uuidv4(),
        senderId: user3Id,
        text: 'Hello, le prix du MacBook est-il négociable ?',
        createdAt: new Date(
          new Date().setMinutes(new Date().getMinutes() - 30)
        ),
      },
      {
        id: uuidv4(),
        senderId: user2Id,
        text: 'Bonjour, légèrement. Quelle est votre proposition ?',
        createdAt: new Date(new Date().setMinutes(new Date().getMinutes() - 5)),
      },
    ],
  },
];
