
export enum ListingType {
  OFFER = 'OFFRE',
  DEMAND = 'DEMANDE',
}

export enum Category {
  ALIMENTATION_BOISSONS = 'Alimentation / Boissons',
  ANIMAUX = 'Animaux',
  ASSOCIATIONS_COMMUNAUTE = 'Associations / Communauté',
  AUTOMOBILE_VEHICULES = 'Automobile / Véhicules',
  DIVERS_COLLECTIONS = 'Divers / Collections / Art / Luxe',
  EVENEMENTS_BILLETTERIE = 'Événements / Billetterie',
  FAMILLE_ENFANTS = 'Famille / Enfants',
  FORMATION_EDUCATION = 'Formation / Éducation',
  IMMOBILIER = 'Immobilier',
  INFORMATIQUE_HIGHTECH = 'Informatique / High-Tech',
  LOISIRS_MULTIMEDIA = 'Loisirs / Multimédia',
  MAISON_DECORATION = 'Maison / Décoration',
  MATERIEL_PROFESSIONNEL = 'Matériel professionnel',
  RECRUTEMENT_EMPLOI = 'Recrutement / Emploi',
  RELIGION = 'Religion',
  SANTE_BIENETRE = 'Santé / Bien-être',
  SERVICES = 'Services',
  VETEMENTS_MODE = 'Vêtements / Mode',
  VOYAGES_TOURISME = 'Voyages / Tourisme',
  AUTRES = 'Autres',
}

// Tableau des catégories dans l'ordre alphabétique (Autres à la fin)
export const CATEGORIES_SORTED = [
  Category.ALIMENTATION_BOISSONS,
  Category.ANIMAUX,
  Category.ASSOCIATIONS_COMMUNAUTE,
  Category.AUTOMOBILE_VEHICULES,
  Category.DIVERS_COLLECTIONS,
  Category.EVENEMENTS_BILLETTERIE,
  Category.FAMILLE_ENFANTS,
  Category.FORMATION_EDUCATION,
  Category.IMMOBILIER,
  Category.INFORMATIQUE_HIGHTECH,
  Category.LOISIRS_MULTIMEDIA,
  Category.MAISON_DECORATION,
  Category.MATERIEL_PROFESSIONNEL,
  Category.RECRUTEMENT_EMPLOI,
  Category.RELIGION,
  Category.SANTE_BIENETRE,
  Category.SERVICES,
  Category.VETEMENTS_MODE,
  Category.VOYAGES_TOURISME,
  Category.AUTRES,
];

export const CITIES_ISRAEL = [
  "Acre (Akko)",
  "Afula",
  "Arad",
  "Ashdod",
  "Ashkelon",
  "Bat Yam",
  "Beer Sheva",
  "Beit Shemesh",
  "Bnei Brak",
  "Dimona",
  "Eilat",
  "Haïfa",
  "Hadera",
  "Harish",
  "Herzliya",
  "Holon",
  "Jérusalem",
  "Karmiel",
  "Kfar Saba",
  "Kfar Yona",
  "Kiryat Bialik",
  "Kiryat Gat",
  "Kiryat Motzkin",
  "Kiryat Ono",
  "Kiryat Yam",
  "Lod",
  "Migdal HaEmek",
  "Modi'in-Maccabim-Re'ut",
  "Nahariya",
  "Nazareth",
  "Nesher",
  "Netanya",
  "Ofakim",
  "Or Yehuda",
  "Petah Tikva",
  "Ra'anana",
  "Ramla",
  "Ramat Gan",
  "Rehovot",
  "Rishon LeZion",
  "Safed (Tsfat)",
  "Sakhnin",
  "Tel Aviv-Jaffa",
  "Tiberias",
  "Tirat Carmel",
  "Yavne",
  "Autres"
];

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  city: string;
  images: string[];
  type: ListingType;
  user?: {
    id: string;
    name: string;
    email?: string;
    avatarUrl: string;
    phone?: string;
    city: string;
  };
  boostedAt?: string | null;
  boostedUntil?: string | null;
  isBoosted?: boolean;
  isHidden?: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  favorites: string[]; // array of listing IDs
  is_admin?: boolean;
  is_banned?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  listingId: string;
  participantIds: string[];
  messages: Message[];
}