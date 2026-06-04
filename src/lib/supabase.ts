const SUPABASE_REST_URL = "https://ecjvcilxbwpnliibgybv.supabase.co/rest/v1";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TTKdey8dP35cIr-NsiYTZg_VJM9httB";

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
    throw new Error(message || `Supabase request failed: ${response.status}`);
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

export function adminLogin(email: string, password: string) {
  return rpc<AdminSession>("admin_login", {
    login_email: email,
    login_password: password,
  });
}

export function loadAdminDashboard(token: string) {
  return rpc<AdminDashboardData>("admin_dashboard_data", {
    session_token: token,
  });
}

export function adminCreateProduct(token: string, product: ProductInput) {
  return rpc<AdminProduct>("admin_create_product", {
    session_token: token,
    product,
  });
}

export function adminDeleteProduct(token: string, productId: string) {
  return rpc<{ deleted: boolean }>("admin_delete_product", {
    session_token: token,
    product_id: productId,
  });
}

export function adminCreateUser(token: string, user: { email: string; name: string; role: AdminRole; password: string }) {
  return rpc<AdminUser>("admin_create_user", {
    session_token: token,
    new_email: user.email,
    new_name: user.name,
    new_role: user.role,
    new_password: user.password,
  });
}

export function adminDeleteUser(token: string, userId: string) {
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
