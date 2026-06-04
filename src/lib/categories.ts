import type { LucideIcon } from "lucide-react";
import {
  Paintbrush,
  Layers,
  Brush,
  Wrench,
  Gem,
  Droplets,
  Sparkles,
  Link2,
  Zap,
  Package,
} from "lucide-react";

export type SubCategory = {
  id: string;
  label: string;
};

export type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  image?: string;
  subcategories: SubCategory[];
};

export const CATEGORIES: Category[] = [
  {
    id: "vernis",
    label: "Vernis",
    icon: Paintbrush,
    color: "#f9a8d4",
    image: "https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6",
    subcategories: [
      { id: "canni", label: "Canni" },
      { id: "venalisa", label: "Venalisa" },
    ],
  },
  {
    id: "coats",
    label: "Coats",
    icon: Layers,
    color: "#fca5a5",
    image: "https://hercules-cdn.com/file_8r6fY6tok9GV86nd3obHx0NV",
    subcategories: [
      { id: "canni", label: "Canni" },
      { id: "venalisa", label: "Venalisa" },
    ],
  },
  {
    id: "pinceau",
    label: "Pinceau",
    icon: Brush,
    color: "#fdba74",
    image: "https://hercules-cdn.com/file_0k64ARE9trLk3yCFUeM3TwqG",
    subcategories: [],
  },
  {
    id: "tools",
    label: "Tools",
    icon: Wrench,
    color: "#d8b4fe",
    image: "https://hercules-cdn.com/file_5PMdmdYL1K4dAOwTB9Ql7YyW",
    subcategories: [],
  },
  {
    id: "capsules",
    label: "Capsules",
    icon: Gem,
    color: "#a5f3fc",
    image: "https://hercules-cdn.com/file_kGUpxK72XaaIBgGOIXY7vrxZ",
    subcategories: [],
  },
  {
    id: "gels",
    label: "Gels",
    icon: Droplets,
    color: "#bbf7d0",
    image: "https://hercules-cdn.com/file_UmIrFdNvYGhn1kdpHrsPAtmN",
    subcategories: [
      { id: "canni", label: "Canni" },
      { id: "venalisa", label: "Venalisa" },
      { id: "frams", label: "Frams" },
    ],
  },
  {
    id: "decoration",
    label: "Décoration",
    icon: Sparkles,
    color: "#fde68a",
    image: "https://hercules-cdn.com/file_qD1QGZqzNqF1W3KVnpE3x63l",
    subcategories: [
      { id: "poudre", label: "Poudre" },
      { id: "boite", label: "Boite" },
    ],
  },
  {
    id: "glue",
    label: "Glue",
    icon: Link2,
    color: "#e9d5ff",
    image: "https://hercules-cdn.com/file_C74VROiqXB1r39qCix3wF2Bs",
    subcategories: [],
  },
  {
    id: "appareil",
    label: "Appareil",
    icon: Zap,
    color: "#bfdbfe",
    image: "https://hercules-cdn.com/file_J0OFplWLXsf3YDE3UhO57xTp",
    subcategories: [],
  },
  {
    id: "embalage",
    label: "Emballage",
    icon: Package,
    color: "#fed7aa",
    image: "https://hercules-cdn.com/file_eL3rYeVaw8CPArGodwBLRiwk",
    subcategories: [],
  },
];
