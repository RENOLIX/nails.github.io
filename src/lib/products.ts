import { CATEGORIES } from "./categories";

export type Product = {
  id: string;
  name: string;
  reference?: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  images: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
};

const images = {
  vernis: "https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6",
  coats: "https://hercules-cdn.com/file_8r6fY6tok9GV86nd3obHx0NV",
  pinceau: "https://hercules-cdn.com/file_0k64ARE9trLk3yCFUeM3TwqG",
  tools: "https://hercules-cdn.com/file_5PMdmdYL1K4dAOwTB9Ql7YyW",
  capsules: "https://hercules-cdn.com/file_kGUpxK72XaaIBgGOIXY7vrxZ",
  gels: "https://hercules-cdn.com/file_UmIrFdNvYGhn1kdpHrsPAtmN",
  decoration: "https://hercules-cdn.com/file_qD1QGZqzNqF1W3KVnpE3x63l",
  glue: "https://hercules-cdn.com/file_C74VROiqXB1r39qCix3wF2Bs",
  appareil: "https://hercules-cdn.com/file_J0OFplWLXsf3YDE3UhO57xTp",
  emballage: "https://hercules-cdn.com/file_eL3rYeVaw8CPArGodwBLRiwk",
};

export const PRODUCTS: Product[] = [
  {
    id: "canni-cc1",
    name: "Vernis Canni CC1",
    reference: "CC1",
    description: "Vernis gel professionnel, couvrance élégante et tenue brillante pour poses salon.",
    category: "vernis",
    subcategory: "canni",
    price: 850,
    oldPrice: 1000,
    imageUrl: images.vernis,
    images: [images.vernis, images.coats, images.gels],
    isBestSeller: true,
  },
  {
    id: "venalisa-a2",
    name: "Vernis Venalisa A2",
    reference: "A2",
    description: "Teinte douce, application fluide, finition lumineuse pour manucures naturelles.",
    category: "vernis",
    subcategory: "venalisa",
    price: 950,
    imageUrl: images.vernis,
    images: [images.vernis, images.decoration],
    isNew: true,
  },
  {
    id: "base-coat-canni",
    name: "Base Coat Canni",
    reference: "BC-CANNI",
    description: "Base adhérente pour préparer l’ongle et prolonger la tenue de votre pose.",
    category: "coats",
    subcategory: "canni",
    price: 900,
    imageUrl: images.coats,
    images: [images.coats, images.vernis],
    isBestSeller: true,
  },
  {
    id: "gel-builder-venalisa",
    name: "Builder Gel Venalisa",
    reference: "BG-VENA",
    description: "Gel de construction stable, idéal pour gainage, renforcement et extensions.",
    category: "gels",
    subcategory: "venalisa",
    price: 1450,
    oldPrice: 1650,
    imageUrl: images.gels,
    images: [images.gels, images.capsules],
    isNew: true,
  },
  {
    id: "pinceau-pro-liner",
    name: "Pinceau Liner Pro",
    reference: "BR-LINER",
    description: "Pinceau fin pour nail art, traits précis, french et détails décoratifs.",
    category: "pinceau",
    subcategory: "",
    price: 650,
    imageUrl: images.pinceau,
    images: [images.pinceau, images.decoration],
  },
  {
    id: "capsules-soft-square",
    name: "Capsules Soft Square",
    reference: "CAP-SQ",
    description: "Capsules résistantes et faciles à limer pour un rendu net et confortable.",
    category: "capsules",
    subcategory: "",
    price: 1200,
    imageUrl: images.capsules,
    images: [images.capsules, images.glue],
    isBestSeller: true,
  },
  {
    id: "poudre-chrome",
    name: "Poudre Chrome",
    reference: "CHR-01",
    description: "Effet miroir ultra lumineux pour finitions tendance et créations premium.",
    category: "decoration",
    subcategory: "poudre",
    price: 700,
    imageUrl: images.decoration,
    images: [images.decoration, images.vernis],
    isNew: true,
  },
  {
    id: "lampe-uv-led",
    name: "Lampe UV LED",
    reference: "LED-48W",
    description: "Appareil de catalysation rapide avec minuterie, adapté aux gels et vernis semi-permanents.",
    category: "appareil",
    subcategory: "",
    price: 4200,
    imageUrl: images.appareil,
    images: [images.appareil, images.tools],
    isBestSeller: true,
  },
  {
    id: "nail-tool-kit",
    name: "Kit Tools Manucure",
    reference: "KIT-TOOLS",
    description: "Essentiels de préparation et finition pour une pose propre et professionnelle.",
    category: "tools",
    subcategory: "",
    price: 1850,
    imageUrl: images.tools,
    images: [images.tools, images.pinceau],
  },
  {
    id: "nail-glue-pro",
    name: "Glue Pro Capsules",
    reference: "GLUE-PRO",
    description: "Colle précise et résistante pour capsules, tips et réparations rapides.",
    category: "glue",
    subcategory: "",
    price: 450,
    imageUrl: images.glue,
    images: [images.glue, images.capsules],
  },
];

export const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia", "Biskra", "Bechar", "Blida", "Bouira",
  "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Setif", "Saida",
  "Skikda", "Sidi Bel Abbes", "Annaba", "Guelma", "Constantine", "Medea", "Mostaganem", "Msila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdes", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Ain Defla", "Naama", "Ain Temouchent", "Ghardaia", "Relizane",
];

export const DELIVERY_FEES = {
  domicile: 700,
  bureau: 450,
};

export function findCategoryLabel(id: string) {
  return CATEGORIES.find((category) => category.id === id)?.label ?? id;
}
