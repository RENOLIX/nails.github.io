import { PRODUCTS, type Product } from "@/lib/products.ts";
import type { ProductColor } from "@/lib/product-options.ts";

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

  const responseText = await response.text();
  if (!responseText) {
    return null as T;
  }

  return JSON.parse(responseText) as T;
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
  stock: number;
  canni_collection: string | null;
  colors: ProductColor[];
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

export type OrderStatus = "pending" | "confirmed" | "cancelled";

export type OrderUpdateInput = {
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  address: string;
  delivery_method: string;
  note: string;
  status: OrderStatus;
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
  stock: number;
  canni_collection?: string;
  colors?: ProductColor[];
  is_best_seller?: boolean;
  is_new?: boolean;
};

function adminProductToProduct(product: AdminProduct): Product {
  const normalizedName = product.name.toLowerCase();
  const inferredCollection =
    product.canni_collection ??
    (product.category === "vernis" && product.subcategory === "canni" && /^CC[1-8]$/i.test(product.reference ?? "")
      ? product.reference?.toLowerCase()
      : product.category === "vernis" && product.subcategory === "venalisa" && /neon\s*gel\s*nh[1-6]/i.test(product.name)
        ? "neon-gel"
        : product.category === "vernis" && product.subcategory === "venalisa" && /venalisa\s*(509[1-9]|510[0-8])/i.test(product.name)
          ? "gel-v6"
          : product.category === "vernis" && product.subcategory === "venalisa" && /rubber\s*base\s*(01|03)/i.test(normalizedName)
            ? "rubber-base"
            : undefined);

  return {
    id: product.id,
    name: product.name,
    reference: product.reference ?? undefined,
    description: product.description ?? "",
    category: product.category === "glue" ? "pack" : product.category,
    subcategory: product.subcategory ?? "",
    price: Number(product.price),
    oldPrice: product.old_price ? Number(product.old_price) : undefined,
    imageUrl: product.image_url ?? "",
    images: product.images?.length ? product.images : product.image_url ? [product.image_url] : [],
    stock: Number(product.stock ?? 20),
    canniCollection: inferredCollection,
    colors: Array.isArray(product.colors) ? product.colors : [],
    isBestSeller: product.is_best_seller,
    isNew: product.is_new,
  };
}

function productToAdminProduct(product: Product): AdminProduct {
  return {
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
    stock: product.stock,
    canni_collection: product.canniCollection ?? null,
    colors: product.colors,
    is_best_seller: Boolean(product.isBestSeller),
    is_new: Boolean(product.isNew),
    active: true,
    created_at: new Date().toISOString(),
  };
}

export function adminProductsToProducts(products: AdminProduct[]) {
  return products.map(adminProductToProduct);
}

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
  return PRODUCTS.map(productToAdminProduct);
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
  const parsed = JSON.parse(raw) as AdminDashboardData;
  const normalized: AdminDashboardData = {
    ...parsed,
    products: parsed.products.map((product) => ({
      ...product,
      images: product.images?.length ? product.images : product.image_url ? [product.image_url] : [],
      stock: Number(product.stock ?? 20),
      canni_collection:
        product.canni_collection ??
        (/^CC[1-8]$/i.test(product.reference ?? "") ? product.reference?.toLowerCase() ?? null : null),
      colors: Array.isArray(product.colors) ? product.colors : [],
    })),
    orders: parsed.orders.map((order) => ({
      ...order,
      status: order.status === "new" ? "pending" : order.status,
    })),
  };
  writeLocalDashboard(normalized);
  return normalized;
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

export async function loadAdminDashboard(token: string) {
  if (isLocalToken(token)) {
    return Promise.resolve(readLocalDashboard());
  }
  return rpc<AdminDashboardData>("admin_dashboard_data", {
    session_token: token,
  });
}

export async function loadAdminProduct(token: string, productId: string) {
  if (isLocalToken(token)) {
    const product = readLocalDashboard().products.find((entry) => entry.id === productId);
    if (!product) throw new Error("Product not found");
    return product;
  }
  return rpc<AdminProduct>("admin_product_detail", {
    session_token: token,
    product_id: productId,
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
      stock: product.stock,
      canni_collection: product.canni_collection || null,
      colors: product.colors ?? [],
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

export function adminUpdateProduct(token: string, productId: string, product: ProductInput) {
  if (isLocalToken(token)) {
    const data = readLocalDashboard();
    let updated: AdminProduct | undefined;
    data.products = data.products.map((entry) => {
      if (entry.id !== productId) return entry;
      updated = {
        ...entry,
        name: product.name,
        reference: product.reference || null,
        description: product.description || null,
        category: product.category,
        subcategory: product.subcategory || null,
        price: product.price,
        old_price: product.old_price ?? null,
        image_url: product.image_url || null,
        images: product.images ?? [],
        stock: product.stock,
        canni_collection: product.canni_collection || null,
        colors: product.colors ?? [],
        is_best_seller: Boolean(product.is_best_seller),
        is_new: Boolean(product.is_new),
        active: true,
      };
      return updated;
    });
    writeLocalDashboard(data);
    return Promise.resolve(updated ?? data.products.find((entry) => entry.id === productId)!);
  }
  return rpc<AdminProduct>("admin_update_product", {
    session_token: token,
    product_id: productId,
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

export function adminUpdateOrder(token: string, orderId: string, order: OrderUpdateInput) {
  if (isLocalToken(token)) {
    const data = readLocalDashboard();
    let updated: AdminOrder | undefined;
    data.orders = data.orders.map((entry) => {
      if (entry.id !== orderId) return entry;
      updated = { ...entry, ...order };
      return updated;
    });
    writeLocalDashboard(data);
    return Promise.resolve(updated ?? data.orders.find((entry) => entry.id === orderId)!);
  }
  return rpc<AdminOrder>("admin_update_order", {
    session_token: token,
    order_id: orderId,
    order_data: order,
  });
}

export function adminDeleteOrder(token: string, orderId: string) {
  if (isLocalToken(token)) {
    const data = readLocalDashboard();
    data.orders = data.orders.filter((order) => order.id !== orderId);
    writeLocalDashboard(data);
    return Promise.resolve({ deleted: true });
  }
  return rpc<{ deleted: boolean }>("admin_delete_order", {
    session_token: token,
    order_id: orderId,
  });
}

export function adminSetReviewApproval(token: string, reviewId: string, approved: boolean) {
  if (isLocalToken(token)) {
    const data = readLocalDashboard();
    let updated: AdminReview | undefined;
    data.reviews = data.reviews.map((review) => {
      if (review.id !== reviewId) return review;
      updated = { ...review, approved };
      return updated;
    });
    writeLocalDashboard(data);
    return Promise.resolve(updated ?? data.reviews.find((review) => review.id === reviewId)!);
  }
  return rpc<AdminReview>("admin_set_review_approval", {
    session_token: token,
    review_id: reviewId,
    next_approved: approved,
  });
}

export function adminDeleteReview(token: string, reviewId: string) {
  if (isLocalToken(token)) {
    const data = readLocalDashboard();
    data.reviews = data.reviews.filter((review) => review.id !== reviewId);
    writeLocalDashboard(data);
    return Promise.resolve({ deleted: true });
  }
  return rpc<{ deleted: boolean }>("admin_delete_review", {
    session_token: token,
    review_id: reviewId,
  });
}

export function adminDeleteProductRequest(token: string, requestId: string) {
  if (isLocalToken(token)) {
    const data = readLocalDashboard();
    data.product_requests = data.product_requests.filter((request) => request.id !== requestId);
    writeLocalDashboard(data);
    return Promise.resolve({ deleted: true });
  }
  return rpc<{ deleted: boolean }>("admin_delete_product_request", {
    session_token: token,
    request_id: requestId,
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

export async function createOrder(order: {
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
  try {
    return await rpc<AdminOrder>("create_public_order", { order_data: order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!message.toLowerCase().includes("function") && !message.includes("PGRST202")) {
      throw error;
    }
    return supabaseRequest<AdminOrder[]>("orders", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: { ...order, status: "pending" },
    });
  }
}

export function createReview(review: { name: string; rating: number; message: string }) {
  return supabaseRequest("reviews", {
    method: "POST",
    body: { ...review, approved: false },
  });
}

export function createProductRequest(request: { name: string; phone: string; product: string }) {
  return supabaseRequest("product_requests", {
    method: "POST",
    body: { ...request, status: "new" },
  });
}

export function listApprovedReviews() {
  return supabaseRequest<AdminReview[]>(
    "reviews?select=id,name,rating,message,approved,created_at&approved=eq.true&order=created_at.desc",
    { method: "GET" },
  );
}

export async function listPublicProducts() {
  const rows = await supabaseRequest<AdminProduct[]>(
    "products?select=*&active=eq.true&order=created_at.desc",
    {
      method: "GET",
    },
  );

  return adminProductsToProducts(rows);
}
