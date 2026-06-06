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

const categoryImage = (name: string) =>
  `${import.meta.env.BASE_URL}images/categories/${name}.png`;

export const CATEGORIES: Category[] = [
  {
    id: "vernis",
    label: "Vernis",
    icon: Paintbrush,
    color: "#f9a8d4",
    image: categoryImage("vernis"),
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
    image: categoryImage("coats"),
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
    image: categoryImage("pinceau"),
    subcategories: [],
  },
  {
    id: "tools",
    label: "Tools",
    icon: Wrench,
    color: "#d8b4fe",
    image: categoryImage("tools"),
    subcategories: [],
  },
  {
    id: "capsules",
    label: "Capsules",
    icon: Gem,
    color: "#a5f3fc",
    image: categoryImage("capsules"),
    subcategories: [],
  },
  {
    id: "gels",
    label: "Gels",
    icon: Droplets,
    color: "#bbf7d0",
    image: categoryImage("gels"),
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
    image: categoryImage("decoration"),
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
    image: categoryImage("glue"),
    subcategories: [],
  },
  {
    id: "appareil",
    label: "Appareil",
    icon: Zap,
    color: "#bfdbfe",
    image: categoryImage("appareil"),
    subcategories: [],
  },
  {
    id: "embalage",
    label: "Emballage",
    icon: Package,
    color: "#fed7aa",
    image: categoryImage("embalage"),
    subcategories: [],
  },
];
