import {
  BarChart3,
  Clock,
  Eye,
  Lock,
  LogOut,
  MessageSquareText,
  Package,
  PackagePlus,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { CATEGORIES } from "@/lib/categories.ts";
import { formatDzd } from "@/lib/utils.ts";
import {
  adminCreateProduct,
  adminCreateUser,
  adminDeleteProduct,
  adminDeleteUser,
  adminLogin,
  loadAdminDashboard,
  type AdminDashboardData,
  type AdminRole,
  type AdminSession,
} from "@/lib/supabase.ts";

const LOGO_URL = "https://hercules-cdn.com/file_kph7rblw10KlLe96KcNfrsHH";
const SESSION_KEY = "nails-admin-session";

type AdminTab = "overview" | "products" | "orders" | "reviews" | "users";

const emptyDashboard: AdminDashboardData = {
  products: [],
  orders: [],
  reviews: [],
  product_requests: [],
  users: [],
};

function readSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-DZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  icon: typeof Package;
  tone: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-[0_22px_80px_-58px_rgba(15,23,42,0.75)]">
      <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function LoginPanel({ onLogin }: { onLogin: (session: AdminSession) => void }) {
  const [email, setEmail] = useState("admin@nailsymagic.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const session = await adminLogin(email.trim().toLowerCase(), password);
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      onLogin(session);
      toast.success("Bienvenue dans l'admin Nailsy Magic");
    } catch {
      toast.error("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_left,#ffe4ef,transparent_32%),linear-gradient(135deg,#fff7fb,#f8fafc_55%,#ffe5ef)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden lg:block">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/55 p-8 shadow-[0_30px_120px_-65px_rgba(219,39,119,0.9)] backdrop-blur">
            <div className="absolute right-8 top-8 rounded-full bg-pink-500 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
              Staff only
            </div>
            <img src={LOGO_URL} alt="Nailsy Magic" className="h-24 w-auto" />
            <h1 className="mt-16 max-w-md text-5xl font-black leading-[0.95] text-slate-950">
              Console privée Nailsy Magic.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">
              Produits, commandes, avis et équipe dans une interface propre, rapide et cachée du site public.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-3">
              {["Produits", "Commandes", "Equipe"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/80 px-4 py-5 text-center text-sm font-black text-slate-800">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-[2rem] border border-white/90 bg-white p-6 shadow-[0_30px_110px_-70px_rgba(15,23,42,0.9)] md:p-8">
          <div className="mb-8 text-center">
            <img src={LOGO_URL} alt="Nailsy Magic" className="mx-auto h-20 w-auto" />
            <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-950">Connexion admin</h2>
            <p className="mt-2 text-sm text-slate-500">Lien discret: /admin</p>
          </div>

          <form className="space-y-4" onSubmit={submitLogin}>
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">Email</label>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="h-12 rounded-2xl" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">Mot de passe</label>
              <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="h-12 rounded-2xl" />
            </div>
            <Button disabled={loading} className="h-12 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-800">
              <ShieldCheck className="h-4 w-4" />
              {loading ? "Connexion..." : "Entrer dans l'admin"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState<AdminSession | null>(() => (typeof window === "undefined" ? null : readSession()));
  const [tab, setTab] = useState<AdminTab>("overview");
  const [dashboard, setDashboard] = useState<AdminDashboardData>(emptyDashboard);
  const [loading, setLoading] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    reference: "",
    category: "vernis",
    subcategory: "",
    price: "",
    old_price: "",
    image_url: "",
    description: "",
    is_best_seller: false,
    is_new: true,
  });
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "employee" as AdminRole,
    password: "",
  });

  const totals = useMemo(
    () => ({
      revenue: dashboard.orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
      pendingOrders: dashboard.orders.filter((order) => order.status === "new").length,
      pendingReviews: dashboard.reviews.filter((review) => !review.approved).length,
    }),
    [dashboard],
  );

  const refresh = async (activeSession = session) => {
    if (!activeSession) return;
    setLoading(true);
    try {
      const next = await loadAdminDashboard(activeSession.token);
      setDashboard(next);
    } catch {
      toast.error("Session admin expirée. Reconnectez-vous.");
      window.localStorage.removeItem(SESSION_KEY);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [session?.token]);

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setDashboard(emptyDashboard);
  };

  const submitProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    if (!productForm.name.trim() || !productForm.price || !productForm.category) {
      toast.error("Nom, catégorie et prix sont obligatoires.");
      return;
    }
    try {
      await adminCreateProduct(session.token, {
        name: productForm.name.trim(),
        reference: productForm.reference.trim(),
        category: productForm.category,
        subcategory: productForm.subcategory.trim(),
        price: Number(productForm.price),
        old_price: productForm.old_price ? Number(productForm.old_price) : undefined,
        image_url: productForm.image_url.trim(),
        images: productForm.image_url.trim() ? [productForm.image_url.trim()] : [],
        description: productForm.description.trim(),
        is_best_seller: productForm.is_best_seller,
        is_new: productForm.is_new,
      });
      toast.success("Produit ajouté");
      setProductForm((current) => ({ ...current, name: "", reference: "", price: "", old_price: "", image_url: "", description: "" }));
      await refresh();
    } catch {
      toast.error("Impossible d'ajouter le produit.");
    }
  };

  const removeProduct = async (productId: string) => {
    if (!session) return;
    try {
      await adminDeleteProduct(session.token, productId);
      toast.success("Produit supprimé");
      await refresh();
    } catch {
      toast.error("Suppression impossible.");
    }
  };

  const submitUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    if (!userForm.email.trim() || !userForm.name.trim() || userForm.password.length < 8) {
      toast.error("Nom, email et mot de passe 8 caractères minimum.");
      return;
    }
    try {
      await adminCreateUser(session.token, {
        email: userForm.email.trim().toLowerCase(),
        name: userForm.name.trim(),
        role: userForm.role,
        password: userForm.password,
      });
      toast.success("Utilisateur ajouté");
      setUserForm({ name: "", email: "", role: "employee", password: "" });
      await refresh();
    } catch {
      toast.error("Impossible d'ajouter l'utilisateur.");
    }
  };

  const removeUser = async (userId: string) => {
    if (!session) return;
    try {
      await adminDeleteUser(session.token, userId);
      toast.success("Utilisateur supprimé");
      await refresh();
    } catch {
      toast.error("Suppression utilisateur impossible.");
    }
  };

  if (!session) {
    return <LoginPanel onLogin={setSession} />;
  }

  const nav = [
    { id: "overview", label: "Vue globale", icon: BarChart3 },
    { id: "products", label: "Produits", icon: Package },
    { id: "orders", label: "Commandes", icon: Eye },
    { id: "reviews", label: "Avis", icon: MessageSquareText },
    { id: "users", label: "Equipe", icon: Users },
  ] satisfies Array<{ id: AdminTab; label: string; icon: typeof Package }>;

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-5 lg:flex-row lg:px-6">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:w-72">
          <div className="flex h-full flex-col rounded-[1.75rem] border border-white bg-white p-4 shadow-[0_30px_90px_-70px_rgba(15,23,42,0.85)]">
            <div className="mb-6 flex items-center gap-3 px-2">
              <img src={LOGO_URL} alt="Nailsy Magic" className="h-14 w-auto" />
            </div>
            <nav className="grid gap-2">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                      tab === item.id ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15" : "text-slate-600 hover:bg-pink-50 hover:text-pink-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto rounded-2xl bg-pink-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-500">{session.user.role}</p>
              <p className="mt-1 truncate text-sm font-black text-slate-950">{session.user.name}</p>
              <p className="truncate text-xs text-slate-500">{session.user.email}</p>
              <Button onClick={logout} variant="outline" className="mt-4 h-10 w-full rounded-xl">
                <LogOut className="h-4 w-4" />
                Sortir
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-5 rounded-[1.75rem] border border-white bg-white/90 p-5 shadow-[0_20px_80px_-70px_rgba(15,23,42,0.8)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-pink-500">Nailsy Magic Admin</p>
                <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Tableau de bord</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
                  {loading ? "Synchronisation..." : "Connecté"}
                </span>
                <Button onClick={() => refresh()} variant="outline" className="rounded-full">
                  Rafraîchir
                </Button>
              </div>
            </div>
          </header>

          {(tab === "overview" || loading) && (
            <section className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Produits actifs" value={dashboard.products.length} icon={Package} tone="bg-pink-50 text-pink-600" />
                <StatCard label="Commandes nouvelles" value={totals.pendingOrders} icon={PackagePlus} tone="bg-blue-50 text-blue-600" />
                <StatCard label="Chiffre commandes" value={formatDzd(totals.revenue)} icon={Sparkles} tone="bg-violet-50 text-violet-600" />
                <StatCard label="Avis à valider" value={totals.pendingReviews} icon={MessageSquareText} tone="bg-amber-50 text-amber-600" />
              </div>
              <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                <Panel title="Dernières commandes" icon={Clock}>
                  <CompactOrders orders={dashboard.orders.slice(0, 5)} />
                </Panel>
                <Panel title="Demandes produits" icon={PackagePlus}>
                  <div className="space-y-3">
                    {dashboard.product_requests.slice(0, 6).map((request) => (
                      <div key={request.id} className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-black text-slate-950">{request.name}</p>
                          <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-black text-pink-700">{request.status}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{request.product}</p>
                        <p className="mt-2 text-xs font-semibold text-slate-400">{request.phone || "Sans téléphone"} · {formatDate(request.created_at)}</p>
                      </div>
                    ))}
                    {dashboard.product_requests.length === 0 && <p className="py-8 text-center text-sm text-slate-400">Aucune demande produit.</p>}
                  </div>
                </Panel>
              </div>
            </section>
          )}

          {tab === "products" && (
            <section className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
              <Panel title="Ajouter un produit" icon={Plus}>
                <form className="space-y-4" onSubmit={submitProduct}>
                  <Input value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} placeholder="Nom du produit" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={productForm.reference} onChange={(event) => setProductForm({ ...productForm, reference: event.target.value })} placeholder="Référence" />
                    <Input value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} inputMode="numeric" placeholder="Prix DA" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <select value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                      {CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                    </select>
                    <Input value={productForm.subcategory} onChange={(event) => setProductForm({ ...productForm, subcategory: event.target.value })} placeholder="Sous-catégorie" />
                  </div>
                  <Input value={productForm.old_price} onChange={(event) => setProductForm({ ...productForm, old_price: event.target.value })} inputMode="numeric" placeholder="Ancien prix optionnel" />
                  <Input value={productForm.image_url} onChange={(event) => setProductForm({ ...productForm, image_url: event.target.value })} placeholder="URL image" />
                  <Textarea value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} placeholder="Description produit" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold">
                      <input type="checkbox" checked={productForm.is_new} onChange={(event) => setProductForm({ ...productForm, is_new: event.target.checked })} />
                      Nouveau
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold">
                      <input type="checkbox" checked={productForm.is_best_seller} onChange={(event) => setProductForm({ ...productForm, is_best_seller: event.target.checked })} />
                      Best seller
                    </label>
                  </div>
                  <Button className="h-11 w-full rounded-xl bg-pink-600 hover:bg-pink-700">Ajouter</Button>
                </form>
              </Panel>
              <Panel title="Catalogue Supabase" icon={Package}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      <tr>
                        <th className="pb-3">Produit</th>
                        <th className="pb-3">Catégorie</th>
                        <th className="pb-3">Prix</th>
                        <th className="pb-3">Tags</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dashboard.products.map((product) => (
                        <tr key={product.id}>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <img src={product.image_url || LOGO_URL} alt={product.name} className="h-12 w-12 rounded-2xl object-cover" />
                              <div>
                                <p className="font-black text-slate-950">{product.name}</p>
                                <p className="text-xs text-slate-400">{product.reference || "Sans référence"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 font-semibold text-slate-600">{product.category}{product.subcategory ? ` / ${product.subcategory}` : ""}</td>
                          <td className="py-4 font-black text-pink-600">{formatDzd(Number(product.price))}</td>
                          <td className="py-4">
                            <div className="flex flex-wrap gap-2">
                              {product.is_new && <Tag>Nouveau</Tag>}
                              {product.is_best_seller && <Tag>Best</Tag>}
                              {!product.active && <Tag>Inactif</Tag>}
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <button type="button" onClick={() => removeProduct(product.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {dashboard.products.length === 0 && <p className="py-12 text-center text-sm text-slate-400">Aucun produit Supabase pour l'instant.</p>}
                </div>
              </Panel>
            </section>
          )}

          {tab === "orders" && (
            <Panel title="Commandes du site" icon={Eye}>
              <CompactOrders orders={dashboard.orders} detailed />
            </Panel>
          )}

          {tab === "reviews" && (
            <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
              <Panel title="Avis client" icon={MessageSquareText}>
                <div className="space-y-3">
                  {dashboard.reviews.map((review) => (
                    <article key={review.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-black text-slate-950">{review.name}</h3>
                          <p className="text-xs text-slate-400">{formatDate(review.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-yellow-500">{"★".repeat(review.rating)}</span>
                          <Tag>{review.approved ? "Publié" : "En attente"}</Tag>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{review.message}</p>
                    </article>
                  ))}
                  {dashboard.reviews.length === 0 && <p className="py-12 text-center text-sm text-slate-400">Aucun avis reçu.</p>}
                </div>
              </Panel>
              <Panel title="Demandes produits" icon={PackagePlus}>
                <div className="space-y-3">
                  {dashboard.product_requests.map((request) => (
                    <article key={request.id} className="rounded-2xl bg-pink-50 p-4">
                      <p className="font-black text-slate-950">{request.name}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{request.product}</p>
                      <p className="mt-3 text-xs font-semibold text-slate-500">{request.phone || "Sans téléphone"} · {formatDate(request.created_at)}</p>
                    </article>
                  ))}
                  {dashboard.product_requests.length === 0 && <p className="py-12 text-center text-sm text-slate-400">Aucune demande.</p>}
                </div>
              </Panel>
            </section>
          )}

          {tab === "users" && (
            <section className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
              <Panel title="Ajouter un accès" icon={UserPlus}>
                {session.user.role !== "admin" ? (
                  <p className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">Seul un admin peut gérer les utilisateurs.</p>
                ) : (
                  <form className="space-y-4" onSubmit={submitUser}>
                    <Input value={userForm.name} onChange={(event) => setUserForm({ ...userForm, name: event.target.value })} placeholder="Nom" />
                    <Input value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} type="email" placeholder="Email" />
                    <select value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value as AdminRole })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">
                      <option value="employee">Employé</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Input value={userForm.password} onChange={(event) => setUserForm({ ...userForm, password: event.target.value })} type="password" placeholder="Mot de passe" />
                    <Button className="h-11 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800">Créer l'utilisateur</Button>
                  </form>
                )}
              </Panel>
              <Panel title="Utilisateurs admin" icon={Users}>
                <div className="space-y-3">
                  {dashboard.users.map((user) => (
                    <div key={user.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-black text-slate-950">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">{formatDate(user.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag>{user.role === "admin" ? "Admin" : "Employé"}</Tag>
                        {session.user.role === "admin" && user.id !== session.user.id && (
                          <button type="button" onClick={() => removeUser(user.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Package; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-white bg-white/95 p-5 shadow-[0_22px_88px_-72px_rgba(15,23,42,0.85)]">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{children}</span>;
}

function CompactOrders({ orders, detailed = false }: { orders: AdminDashboardData["orders"]; detailed?: boolean }) {
  if (orders.length === 0) {
    return <p className="py-12 text-center text-sm text-slate-400">Aucune commande pour l'instant.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.16em] text-slate-400">
          <tr>
            <th className="pb-3">Client</th>
            <th className="pb-3">Livraison</th>
            <th className="pb-3">Produits</th>
            <th className="pb-3">Total</th>
            <th className="pb-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="py-4">
                <p className="font-black text-slate-950">{order.customer_name}</p>
                <p className="text-xs text-slate-500">{order.customer_phone}</p>
              </td>
              <td className="py-4">
                <p className="font-semibold text-slate-700">{order.wilaya || "-"} · {order.delivery_method || "-"}</p>
                {detailed && <p className="max-w-xs truncate text-xs text-slate-400">{order.address || "-"}</p>}
              </td>
              <td className="py-4 text-slate-600">
                {order.items?.slice(0, detailed ? 4 : 2).map((item, index) => (
                  <p key={`${order.id}-${index}`} className="truncate">
                    {String(item.name ?? "Produit")} x{String(item.quantity ?? 1)}
                  </p>
                ))}
              </td>
              <td className="py-4 font-black text-pink-600">{formatDzd(Number(order.total))}</td>
              <td className="py-4 text-xs font-semibold text-slate-400">{formatDate(order.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
