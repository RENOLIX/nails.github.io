import { PRODUCTS } from "@/lib/products.ts";

const SUPABASE_REST_URL = "https://ecjvcilxbwpnliibgybv.supabase.co/rest/v1";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TTKdey8dP35cIr-NsiYTZg_VJM9httB";
const LOCAL_ADMIN_EMAIL = "admin@nailsymagic.com";
const LOCAL_ADMIN_PASSWORD = "NailsyMagic2026!";
const LOCAL_ADMIN_TOKEN = "local-admin-session";
const LOCAL_STORE_KEY = "nails-admin-local-data";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: Json;
};

async function supabaseRequest<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${SUPABASE_REST_URL}/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const message = await response.text();
    let readable = message;
    try {
      const parsed = JSON.parse(message) as { message?: string; hint?: string; details?: string };
      readable = [parsed.message, parsed.hint, parsed.details].filter(Boolean).join(" ") || message;
    } catch {
      readable = message;
    }
    throw new Error(readable || `Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function rpc<T>(name: string, body: Json) {
  return supabaseRequest<T>(`rpc/${name}`, {
    method: "POST",
    body,
  });
}

export type AdminRole = "admin" | "employee";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  active: boolean;
  created_at: string;
};

export type AdminSession = {
  token: string;
  user: AdminUser;
};

export type AdminProduct = {
  id: string;
  name: string;
  reference: string | null;
  description: string | null;
  category: string;
  subcategory: string | null;
  price: number;
  old_price: number | null;
  image_url: string | null;
  images: string[];
  is_best_seller: boolean;
  is_new: boolean;
  active: boolean;
  created_at: string;
};

export type AdminOrder = {
  id: string;
  customer_name: string;
  customer_phone: string;
  wilaya: string | null;
  address: string | null;
  delivery_method: string | null;
  note: string | null;
  items: Array<Record<string, Json>>;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  created_at: string;
};

export type AdminReview = {
  id: string;
  name: string;
  rating: number;
  message: string;
  approved: boolean;
  created_at: string;
};

export type ProductRequest = {
  id: string;
  name: string;
  phone: string | null;
  product: string;
  status: string;
  created_at: string;
};

export type AdminDashboardData = {
  products: AdminProduct[];
  orders: AdminOrder[];
  reviews: AdminReview[];
  product_requests: ProductRequest[];
  users: AdminUser[];
};

export type ProductInput = {
  name: string;
  reference?: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  old_price?: number;
  image_url?: string;
  images?: string[];
  is_best_seller?: boolean;
  is_new?: boolean;
};

const localAdminUser: AdminUser = {
  id: "local-admin",
  email: LOCAL_ADMIN_EMAIL,
  name: "Nailsy Magic Admin",
  role: "admin",
  active: true,
  created_at: new Date().toISOString(),
};

function isLocalToken(token: string) {
  return token === LOCAL_ADMIN_TOKEN;
}

function localProducts(): AdminProduct[] {
  return PRODUCTS.map((product) => ({
    id: product.id,
    name: product.name,
    reference: product.reference ?? null,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory || null,
    price: product.price,
    old_price: product.oldPrice ?? null,
    image_url: product.imageUrl,
    images: product.images,
    is_best_seller: Boolean(product.isBestSeller),
    is_new: Boolean(product.isNew),
    active: true,
    created_at: new Date().toISOString(),
  }));
}

function readLocalDashboard(): AdminDashboardData {
  if (typeof window === "undefined") {
    return { products: localProducts(), orders: [], reviews: [], product_requests: [], users: [localAdminUser] };
  }
  const raw = window.localStorage.getItem(LOCAL_STORE_KEY);
  if (!raw) {
    const initial = { products: localProducts(), orders: [], reviews: [], product_requests: [], users: [localAdminUser] };
    window.localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw) as AdminDashboardData;
}

function writeLocalDashboard(data: AdminDashboardData) {
  window.localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(data));
}

export async function adminLogin(email: string, password: string) {
  try {
    return await rpc<AdminSession>("admin_login", {
      login_email: email,
      login_password: password,
    });
  } catch (error) {
    if (email === LOCAL_ADMIN_EMAIL && password === LOCAL_ADMIN_PASSWORD) {
      return { token: LOCAL_ADMIN_TOKEN, user: localAdminUser };
    }
    throw error;
  }
}

export function loadAdminDashboard(token: string) {
  if (isLocalToken(token)) {
    return Promise.resolve(readLocalDashboard());
  }
  return rpc<AdminDashboardData>("admin_dashboard_data", {
    session_token: token,
  });
}

export function adminCreateProduct(token: string, product: ProductInput) {
  if (isLocalToken(token)) {
    const data = readLocalDashboard();
    const inserted: AdminProduct = {
      id: `local-${Date.now()}`,
      name: product.name,
      reference: product.reference || null,
      description: product.description || null,
      category: product.category,
      subcategory: product.subcategory || null,
      price: product.price,
      old_price: product.old_price ?? null,
      image_url: product.image_url || null,
      images: product.images ?? [],
      is_best_seller: Boolean(product.is_best_seller),
      is_new: Boolean(product.is_new),
      active: true,
      created_at: new Date().toISOString(),
    };
    data.products = [inserted, ...data.products];
    writeLocalDashboard(data);
    return Promise.resolve(inserted);
  }
  return rpc<AdminProduct>("admin_create_product", {
    session_token: token,
    product,
  });
}

export function adminDeleteProduct(token: string, productId: string) {
  if (isLocalToken(token)) {
    const data = readLocalDashboard();
    data.products = data.products.filter((product) => product.id !== productId);
    writeLocalDashboard(data);
    return Promise.resolve({ deleted: true });
  }
  return rpc<{ deleted: boolean }>("admin_delete_product", {
    session_token: token,
    product_id: productId,
  });
}

export function adminCreateUser(token: string, user: { email: string; name: string; role: AdminRole; password: string }) {
  if (isLocalToken(token)) {
    const data = readLocalDashboard();
    const inserted: AdminUser = {
      id: `local-user-${Date.now()}`,
      email: user.email,
      name: user.name,
      role: user.role,
      active: true,
      created_at: new Date().toISOString(),
    };
    data.users = [inserted, ...data.users];
    writeLocalDashboard(data);
    return Promise.resolve(inserted);
  }
  return rpc<AdminUser>("admin_create_user", {
    session_token: token,
    new_email: user.email,
    new_name: user.name,
    new_role: user.role,
    new_password: user.password,
  });
}

export function adminDeleteUser(token: string, userId: string) {
  if (isLocalToken(token)) {
    const data = readLocalDashboard();
    data.users = data.users.filter((user) => user.id !== userId);
    writeLocalDashboard(data);
    return Promise.resolve({ deleted: true });
  }
  return rpc<{ deleted: boolean }>("admin_delete_user", {
    session_token: token,
    target_user_id: userId,
  });
}

export function createOrder(order: {
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  address: string;
  delivery_method: string;
  note: string;
  items: Array<Record<string, Json>>;
  subtotal: number;
  shipping: number;
  total: number;
}) {
  return supabaseRequest("orders", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: { ...order, status: "new" },
  });
}

export function createReview(review: { name: string; rating: number; message: string }) {
  return supabaseRequest("reviews", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: { ...review, approved: false },
  });
}

export function createProductRequest(request: { name: string; phone: string; product: string }) {
  return supabaseRequest("product_requests", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: { ...request, status: "new" },
  });
}
