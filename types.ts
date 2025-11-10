
export enum ListingType {
  OFFER = 'OFFRE',
  DEMAND = 'DEMANDE',
}

export enum Category {
  ALIMENTATION_BOISSONS = 'Alimentation / Boissons',
  ANIMAUX = 'Animaux',
  ASSOCIATIONS_COMMUNAUTE = 'Associations / Communauté',
  DIVERS_COLLECTIONS = 'Divers / Collections / Art / Luxe',
  EMPLOI_SERVICES = 'Emploi / Services',
  EVENEMENTS_BILLETTERIE = 'Événements / Billetterie',
  FAMILLE_ENFANTS = 'Famille / Enfants',
  FORMATION_EDUCATION = 'Formation / Éducation',
  IMMOBILIER = 'Immobilier',
  INFORMATIQUE_HIGHTECH = 'Informatique / High-Tech',
  LOISIRS_MULTIMEDIA = 'Loisirs / Multimédia',
  MAISON_HABITAT = 'Maison / Habitat',
  MATERIEL_PROFESSIONNEL = 'Matériel professionnel',
  MODE = 'Mode',
  RELIGION = 'Religion',
  SANTE_BIENETRE = 'Santé / Bien-être',
  VEHICULES = 'Véhicules',
  VOYAGES_TOURISME = 'Voyages / Tourisme',
  AUTRES = 'Autres',
}

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
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  favorites: string[]; // array of listing IDs
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  // FIX: Renamed `timestamp` to `createdAt` for consistency with other types.
  createdAt: Date;
}

export interface Conversation {
  id: string;
  listingId: string;
  participantIds: string[];
  messages: Message[];
}