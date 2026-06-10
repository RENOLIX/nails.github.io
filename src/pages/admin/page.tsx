import {
  BarChart3,
  Check,
  Clock,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  MessageSquareText,
  Package,
  PackagePlus,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { CATEGORIES } from "@/lib/categories.ts";
import {
  CANNI_COLLECTIONS,
  resolveProductColor,
  type ProductColor,
} from "@/lib/product-options.ts";
import { formatDzd } from "@/lib/utils.ts";
import SafeImage from "@/components/SafeImage.tsx";
import { NAILSY_LOGO } from "@/lib/assets.ts";
import {
  adminCreateProduct,
  adminCreateUser,
  adminDeleteOrder,
  adminDeleteProduct,
  adminDeleteProductRequest,
  adminDeleteReview,
  adminDeleteUser,
  adminLogin,
  adminSetReviewApproval,
  adminUpdateOrder,
  adminUpdateProduct,
  loadAdminDashboard,
  loadAdminProduct,
  type AdminProduct,
  type AdminDashboardData,
  type AdminRole,
  type AdminSession,
  type OrderUpdateInput,
  type OrderStatus,
} from "@/lib/supabase.ts";

const SESSION_KEY = "nails-admin-session";
const MAX_PRODUCT_IMAGES = 6;

type AdminTab = "overview" | "products" | "add-product" | "orders" | "reviews" | "users";

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

function compressProductImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const maxSize = 1400;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Canvas unavailable"));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
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
  const [loginError, setLoginError] = useState("");

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setLoginError("");
    try {
      const session = await adminLogin(email.trim().toLowerCase(), password);
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      onLogin(session);
      toast.success("Bienvenue dans l'admin Nailsy Magic");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      const help = message.includes("function")
        ? "Le SQL Supabase doit etre recolle avec la derniere version du fichier supabase-nails-admin.sql."
        : "Verifiez l'email, le mot de passe et que le SQL Supabase a bien ete execute.";
      setLoginError(`${help} Detail: ${message}`);
      toast.error("Connexion admin impossible.");
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
            <SafeImage src={NAILSY_LOGO} alt="Nailsy Magic" fallbackLabel="Nailsy Magic" fallbackClassName="bg-transparent p-0 text-2xl text-pink-700 ring-0" className="h-24 w-auto" />
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
            <SafeImage src={NAILSY_LOGO} alt="Nailsy Magic" fallbackLabel="Nailsy Magic" fallbackClassName="mx-auto bg-transparent p-0 text-2xl text-pink-700 ring-0" className="mx-auto h-20 w-auto" />
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
            <Button type="submit" disabled={loading} className="h-12 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-800">
              <ShieldCheck className="h-4 w-4" />
              {loading ? "Connexion..." : "Entrer dans l'admin"}
            </Button>
            {loginError ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
                {loginError}
              </div>
            ) : null}
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
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    reference: "",
    category: "vernis",
    subcategory: "",
    price: "",
    old_price: "",
    images: [] as string[],
    stock: "20",
    canni_collection: "",
    colors: [] as ProductColor[],
    description: "",
    is_best_seller: false,
    is_new: true,
  });
  const [colorInput, setColorInput] = useState("");
  const [colorImageIndex, setColorImageIndex] = useState("");
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "employee" as AdminRole,
    password: "",
  });

  const totals = useMemo(
    () => ({
      revenue: dashboard.orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
      pendingOrders: dashboard.orders.filter((order) => order.status === "new" || order.status === "pending").length,
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
    } catch (error) {
      const message = error instanceof Error ? error.message.toLowerCase() : "";
      const sessionInvalid =
        message.includes("invalid session") ||
        message.includes("session expired") ||
        message.includes("unauthorized");

      if (sessionInvalid) {
        toast.error("Session admin expirée. Reconnectez-vous.");
        window.localStorage.removeItem(SESSION_KEY);
        setSession(null);
      } else {
        toast.error("Le tableau de bord n'a pas pu charger. Réessayez dans quelques secondes.");
      }
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

  const resetProductForm = () => {
    setEditingProductId(null);
    setColorInput("");
    setColorImageIndex("");
    setProductForm({
      name: "",
      reference: "",
      category: "vernis",
      subcategory: "",
      price: "",
      old_price: "",
      images: [],
      stock: "20",
      canni_collection: "",
      colors: [],
      description: "",
      is_best_seller: false,
      is_new: true,
    });
  };

  const editProduct = async (product: AdminProduct) => {
    if (!session) return;
    try {
      const detailedProduct = await loadAdminProduct(session.token, product.id);
      setEditingProductId(detailedProduct.id);
      setProductForm({
        name: detailedProduct.name,
        reference: detailedProduct.reference ?? "",
        category: detailedProduct.category,
        subcategory: detailedProduct.subcategory ?? "",
        price: String(detailedProduct.price),
        old_price: detailedProduct.old_price ? String(detailedProduct.old_price) : "",
        images: detailedProduct.images?.length
          ? detailedProduct.images
          : detailedProduct.image_url
            ? [detailedProduct.image_url]
            : [],
        stock: String(detailedProduct.stock ?? 20),
        canni_collection: detailedProduct.canni_collection ?? "",
        colors: detailedProduct.colors ?? [],
        description: detailedProduct.description ?? "",
        is_best_seller: detailedProduct.is_best_seller,
        is_new: detailedProduct.is_new,
      });
      setTab("add-product");
    } catch {
      toast.error("Impossible de charger les détails de ce produit.");
    }
  };

  const submitProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    if (!productForm.name.trim() || !productForm.price || !productForm.category) {
      toast.error("Nom, catégorie et prix sont obligatoires.");
      return;
    }
    if (productForm.category === "vernis" && productForm.subcategory === "canni" && !productForm.canni_collection) {
      toast.error("Choisissez une collection Canni entre CC1 et CC8.");
      return;
    }
    try {
      const payload = {
        name: productForm.name.trim(),
        reference: productForm.reference.trim(),
        category: productForm.category,
        subcategory: productForm.subcategory.trim(),
        price: Number(productForm.price),
        old_price: productForm.old_price ? Number(productForm.old_price) : undefined,
        image_url: productForm.images[0] ?? "",
        images: productForm.images,
        stock: Math.max(0, Number(productForm.stock) || 0),
        canni_collection:
          productForm.category === "vernis" && productForm.subcategory === "canni"
            ? productForm.canni_collection
            : "",
        colors: productForm.colors,
        description: productForm.description.trim(),
        is_best_seller: productForm.is_best_seller,
        is_new: productForm.is_new,
      };
      if (editingProductId) {
        await adminUpdateProduct(session.token, editingProductId, payload);
        toast.success("Produit modifié");
      } else {
        await adminCreateProduct(session.token, payload);
        toast.success("Produit ajouté");
      }
      resetProductForm();
      setTab("products");
      await refresh();
    } catch {
      toast.error("Impossible d'ajouter le produit.");
    }
  };

  const handleProductImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    if (files.some((file) => !file.type.startsWith("image/"))) {
      toast.error("Choisissez uniquement des images.");
      return;
    }
    const availableSlots = MAX_PRODUCT_IMAGES - productForm.images.length;
    if (availableSlots <= 0) {
      toast.error(`Maximum ${MAX_PRODUCT_IMAGES} photos par produit.`);
      return;
    }
    try {
      const compressed = await Promise.all(files.slice(0, availableSlots).map(compressProductImage));
      setProductForm((current) => ({ ...current, images: [...current.images, ...compressed] }));
      if (files.length > availableSlots) {
        toast.info(`Seules ${MAX_PRODUCT_IMAGES} photos maximum ont été conservées.`);
      }
    } catch {
      toast.error("Impossible de préparer une des images.");
    }
  };

  const addProductColor = () => {
    const name = colorInput.trim();
    if (!name) return;
    if (productForm.colors.some((color) => color.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Cette couleur est déjà ajoutée.");
      return;
    }
    setProductForm((current) => ({
      ...current,
      colors: [
        ...current.colors,
        {
          name,
          value: resolveProductColor(name),
          imageIndex: colorImageIndex === "" ? undefined : Number(colorImageIndex),
        },
      ],
    }));
    setColorInput("");
    setColorImageIndex("");
  };

  const removeProductImage = (removedIndex: number) => {
    setProductForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== removedIndex),
      colors: current.colors.map((color) => {
        if (color.imageIndex === undefined) return color;
        if (color.imageIndex === removedIndex) {
          const { imageIndex: _imageIndex, ...rest } = color;
          return rest;
        }
        return color.imageIndex > removedIndex
          ? { ...color, imageIndex: color.imageIndex - 1 }
          : color;
      }),
    }));
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

  const saveOrder = async (orderId: string, order: OrderUpdateInput) => {
    if (!session) return;
    await adminUpdateOrder(session.token, orderId, order);
    toast.success("Commande mise à jour");
    await refresh();
  };

  const removeOrder = async (orderId: string) => {
    if (!session || !window.confirm("Supprimer définitivement cette commande ?")) return;
    try {
      await adminDeleteOrder(session.token, orderId);
      toast.success("Commande supprimée");
      await refresh();
    } catch {
      toast.error("Impossible de supprimer la commande.");
    }
  };

  const setReviewApproval = async (reviewId: string, approved: boolean) => {
    if (!session) return;
    try {
      await adminSetReviewApproval(session.token, reviewId, approved);
      toast.success(approved ? "Avis approuvé et publié" : "Avis désapprouvé");
      await refresh();
    } catch {
      toast.error("Impossible de modifier cet avis.");
    }
  };

  const removeReview = async (reviewId: string) => {
    if (!session || !window.confirm("Supprimer définitivement cet avis ?")) return;
    try {
      await adminDeleteReview(session.token, reviewId);
      toast.success("Avis supprimé");
      await refresh();
    } catch {
      toast.error("Impossible de supprimer cet avis.");
    }
  };

  const removeProductRequest = async (requestId: string) => {
    if (!session || !window.confirm("Supprimer définitivement cette demande produit ?")) return;
    try {
      await adminDeleteProductRequest(session.token, requestId);
      toast.success("Demande supprimée");
      await refresh();
    } catch {
      toast.error("Impossible de supprimer cette demande.");
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
              <SafeImage src={NAILSY_LOGO} alt="Nailsy Magic" fallbackLabel="Nailsy Magic" fallbackClassName="bg-transparent p-0 text-pink-700 ring-0" className="h-14 w-auto" />
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
            <Panel title="Catalogue produit" icon={Package}>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  {dashboard.products.length} produits synchronisés avec le site.
                </p>
                <Button onClick={() => { resetProductForm(); setTab("add-product"); }} className="h-11 rounded-xl bg-pink-600 px-5 hover:bg-pink-700">
                  <Plus className="h-4 w-4" />
                  Ajouter un produit
                </Button>
              </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      <tr>
                        <th className="pb-3">Produit</th>
                        <th className="pb-3">Catégorie</th>
                        <th className="pb-3">Prix</th>
                        <th className="pb-3">Stock</th>
                        <th className="pb-3">Tags</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dashboard.products.map((product) => (
                        <tr key={product.id}>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <SafeImage src={product.image_url || NAILSY_LOGO} alt={product.name} fallbackLabel={product.reference || product.name} className="h-12 w-12 rounded-2xl object-cover" />
                              <div>
                                <p className="font-black text-slate-950">{product.name}</p>
                                <p className="text-xs text-slate-400">{product.reference || "Sans référence"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 font-semibold text-slate-600">{product.category}{product.subcategory ? ` / ${product.subcategory}` : ""}</td>
                          <td className="py-4 font-black text-pink-600">{formatDzd(Number(product.price))}</td>
                          <td className="py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-black ${Number(product.stock ?? 20) > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                              {Number(product.stock ?? 20) > 0 ? `${Number(product.stock ?? 20)} disponible${Number(product.stock ?? 20) > 1 ? "s" : ""}` : "Rupture"}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-wrap gap-2">
                              {product.is_new && <Tag>Nouveau</Tag>}
                              {product.is_best_seller && <Tag>Best</Tag>}
                              {product.canni_collection && <Tag>{product.canni_collection.toUpperCase()}</Tag>}
                              {product.colors?.length > 0 && <Tag>{product.colors.length} couleur{product.colors.length > 1 ? "s" : ""}</Tag>}
                              {!product.active && <Tag>Inactif</Tag>}
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <button type="button" onClick={() => void editProduct(product)} className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-pink-50 hover:text-pink-600" aria-label="Modifier le produit">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => removeProduct(product.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {dashboard.products.length === 0 && <p className="py-12 text-center text-sm text-slate-400">Aucun produit pour l'instant.</p>}
                </div>
            </Panel>
          )}

          {tab === "add-product" && (
            <Panel title={editingProductId ? "Modifier un produit" : "Ajouter un produit"} icon={editingProductId ? Pencil : Plus}>
              <form className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]" onSubmit={submitProduct}>
                <div className="space-y-4">
                  <label className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-pink-200 bg-pink-50/70 p-4 text-center transition hover:border-pink-400 hover:bg-pink-50">
                    {productForm.images[0] ? (
                      <SafeImage src={productForm.images[0]} alt="Aperçu produit" fallbackLabel="Aperçu" className="h-full max-h-[360px] w-full rounded-2xl object-cover" />
                    ) : (
                      <div>
                        <PackagePlus className="mx-auto h-10 w-10 text-pink-400" />
                        <p className="mt-4 text-lg font-black text-slate-950">Téléverser les photos</p>
                        <p className="mt-2 text-sm font-semibold text-slate-500">Jusqu'à {MAX_PRODUCT_IMAGES} photos depuis PC ou téléphone</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={handleProductImages} />
                  </label>
                  {productForm.images.length > 0 && (
                    <>
                      <div className="grid grid-cols-3 gap-2">
                        {productForm.images.map((image, index) => (
                          <div key={`${image.slice(0, 32)}-${index}`} className="group relative overflow-hidden rounded-xl border border-pink-100 bg-white">
                            <SafeImage src={image} alt={`Photo ${index + 1}`} fallbackLabel={`Photo ${index + 1}`} className="aspect-square w-full object-cover" />
                            <span className="absolute left-1 top-1 flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-xs font-black text-slate-950 shadow">
                              {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeProductImage(index)}
                              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/80 text-white"
                              aria-label={`Supprimer la photo ${index + 1}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            {index === 0 && <span className="absolute bottom-1 left-1 rounded-full bg-pink-600 px-2 py-1 text-[10px] font-black text-white">Couverture</span>}
                          </div>
                        ))}
                      </div>
                      {productForm.images.length < MAX_PRODUCT_IMAGES && (
                        <label className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:border-pink-300">
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter d'autres photos
                          <input type="file" accept="image/*" multiple className="sr-only" onChange={handleProductImages} />
                        </label>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <Button type="button" variant="outline" onClick={() => { resetProductForm(); setTab("products"); }} className="rounded-xl">
                      Retour catalogue
                    </Button>
                    <Button type="submit" className="h-11 rounded-xl bg-pink-600 px-6 hover:bg-pink-700">
                      {editingProductId ? "Enregistrer les modifications" : "Enregistrer le produit"}
                    </Button>
                  </div>
                  <Input value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} placeholder="Nom du produit" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={productForm.reference} onChange={(event) => setProductForm({ ...productForm, reference: event.target.value })} placeholder="Référence" />
                    <Input value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} inputMode="numeric" placeholder="Prix DA" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={productForm.old_price} onChange={(event) => setProductForm({ ...productForm, old_price: event.target.value })} inputMode="numeric" placeholder="Ancien prix optionnel" />
                    <Input value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} type="number" min="0" inputMode="numeric" placeholder="Stock disponible" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      value={productForm.category}
                      onChange={(event) =>
                        setProductForm({
                          ...productForm,
                          category: event.target.value,
                          subcategory: "",
                          canni_collection: "",
                        })
                      }
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    >
                      {CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                    </select>
                    {CATEGORIES.find((category) => category.id === productForm.category)?.subcategories.length ? (
                      <select
                        value={productForm.subcategory}
                        onChange={(event) => setProductForm({ ...productForm, subcategory: event.target.value, canni_collection: "" })}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                      >
                        <option value="">Choisir la sous-catégorie</option>
                        {CATEGORIES.find((category) => category.id === productForm.category)?.subcategories.map((subcategory) => (
                          <option key={subcategory.id} value={subcategory.id}>{subcategory.label}</option>
                        ))}
                      </select>
                    ) : (
                      <Input value={productForm.subcategory} onChange={(event) => setProductForm({ ...productForm, subcategory: event.target.value })} placeholder="Sous-catégorie optionnelle" />
                    )}
                  </div>
                  {productForm.category === "vernis" && productForm.subcategory === "canni" && (
                    <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-4">
                      <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-pink-600">Collection Canni</label>
                      <select
                        value={productForm.canni_collection}
                        onChange={(event) => setProductForm({ ...productForm, canni_collection: event.target.value })}
                        className="h-11 w-full rounded-xl border border-pink-200 bg-white px-3 text-sm font-bold"
                      >
                        <option value="">Choisir CC1 à CC8</option>
                        {CANNI_COLLECTIONS.map((collection) => (
                          <option key={collection.id} value={collection.id}>{collection.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <Textarea value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} placeholder="Description produit" />
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="mb-3">
                      <p className="font-black text-slate-950">Couleurs disponibles</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">Écrivez une couleur, par exemple rose, rouge, nude ou #d946ef.</p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-[2.5rem_minmax(0,1fr)_9rem_auto]">
                      <div
                        className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 shadow-inner"
                        style={{ backgroundColor: resolveProductColor(colorInput) }}
                      />
                      <Input
                        value={colorInput}
                        onChange={(event) => setColorInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addProductColor();
                          }
                        }}
                        placeholder="Nom ou code couleur"
                      />
                      <select
                        value={colorImageIndex}
                        onChange={(event) => setColorImageIndex(event.target.value)}
                        disabled={productForm.images.length === 0}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Photo associée à la couleur"
                      >
                        <option value="">Photo auto</option>
                        {productForm.images.map((_, imageIndex) => (
                          <option key={imageIndex} value={imageIndex}>Photo {imageIndex + 1}</option>
                        ))}
                      </select>
                      <Button type="button" variant="outline" onClick={addProductColor} className="h-11 shrink-0 rounded-xl">
                        <Plus className="h-4 w-4" />
                        Ajouter
                      </Button>
                    </div>
                    {productForm.colors.length > 0 && (
                      <div className="mt-3 grid gap-2">
                        {productForm.colors.map((color, index) => (
                          <div key={`${color.name}-${index}`} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 text-sm font-bold text-slate-700">
                            <span className="h-7 w-7 rounded-full border border-black/10" style={{ backgroundColor: color.value }} />
                            <span className="min-w-24 flex-1">{color.name}</span>
                            <select
                              value={color.imageIndex ?? ""}
                              onChange={(event) => {
                                const nextValue = event.target.value;
                                setProductForm((current) => ({
                                  ...current,
                                  colors: current.colors.map((entry, colorIndex) =>
                                    colorIndex === index
                                      ? {
                                          ...entry,
                                          imageIndex: nextValue === "" ? undefined : Number(nextValue),
                                        }
                                      : entry,
                                  ),
                                }));
                              }}
                              disabled={productForm.images.length === 0}
                              className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold disabled:opacity-50"
                              aria-label={`Photo associée à ${color.name}`}
                            >
                              <option value="">Photo auto</option>
                              {productForm.images.map((_, imageIndex) => (
                                <option key={imageIndex} value={imageIndex}>Photo {imageIndex + 1}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => setProductForm((current) => ({ ...current, colors: current.colors.filter((_, colorIndex) => colorIndex !== index) }))}
                              className="ml-1 rounded-full p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                              aria-label={`Supprimer ${color.name}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                </div>
              </form>
            </Panel>
          )}

          {tab === "orders" && (
            <Panel title="Commandes du site" icon={Eye}>
              <OrdersManager orders={dashboard.orders} onSave={saveOrder} onDelete={removeOrder} />
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
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                        {review.approved ? (
                          <Button type="button" variant="outline" onClick={() => void setReviewApproval(review.id, false)} className="rounded-xl">
                            <EyeOff className="h-4 w-4" />
                            Désapprouver
                          </Button>
                        ) : (
                          <Button type="button" onClick={() => void setReviewApproval(review.id, true)} className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                            <Check className="h-4 w-4" />
                            Approuver
                          </Button>
                        )}
                        <Button type="button" variant="outline" onClick={() => void removeReview(review.id)} className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
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
                      <Button type="button" variant="outline" onClick={() => void removeProductRequest(request.id)} className="mt-4 rounded-xl border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
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
                    <Button type="submit" className="h-11 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800">Créer l'utilisateur</Button>
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

const ORDER_STATUS: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-amber-50 text-amber-700" },
  confirmed: { label: "Confirmée", className: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Annulée", className: "bg-red-50 text-red-700" },
};

function normalizeOrderStatus(status: string): OrderStatus {
  if (status === "confirmed" || status === "cancelled") return status;
  return "pending";
}

function OrdersManager({
  orders,
  onSave,
  onDelete,
}: {
  orders: AdminDashboardData["orders"];
  onSave: (orderId: string, order: OrderUpdateInput) => Promise<void>;
  onDelete: (orderId: string) => Promise<void>;
}) {
  if (orders.length === 0) {
    return <p className="py-12 text-center text-sm text-slate-400">Aucune commande pour l'instant.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderEditor key={order.id} order={order} onSave={onSave} onDelete={onDelete} />
      ))}
    </div>
  );
}

function OrderEditor({
  order,
  onSave,
  onDelete,
}: {
  order: AdminDashboardData["orders"][number];
  onSave: (orderId: string, order: OrderUpdateInput) => Promise<void>;
  onDelete: (orderId: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<OrderUpdateInput>({
    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    wilaya: order.wilaya ?? "",
    address: order.address ?? "",
    delivery_method: order.delivery_method ?? "domicile",
    note: order.note ?? "",
    status: normalizeOrderStatus(order.status),
  });
  const statusMeta = ORDER_STATUS[draft.status];

  const save = async () => {
    setSaving(true);
    try {
      await onSave(order.id, draft);
      setEditing(false);
    } catch {
      toast.error("Impossible de modifier cette commande.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-slate-950">{order.customer_name}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${statusMeta.className}`}>{statusMeta.label}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-500">{order.customer_phone} · {order.wilaya || "Wilaya non indiquée"}</p>
          <p className="mt-1 text-xs text-slate-400">{formatDate(order.created_at)} · #{order.id.slice(0, 8)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-2 text-lg font-black text-pink-600">{formatDzd(Number(order.total))}</span>
          <Button type="button" variant="outline" onClick={() => setEditing((current) => !current)} className="rounded-xl">
            <Pencil className="h-4 w-4" />
            {editing ? "Fermer" : "Modifier"}
          </Button>
          <Button type="button" variant="outline" onClick={() => void onDelete(order.id)} className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {order.items?.map((item, index) => (
          <div key={`${order.id}-${index}`} className="text-sm text-slate-700">
            <span className="font-bold">{String(item.name ?? "Produit")}</span>
            <span className="text-slate-400"> x{String(item.quantity ?? 1)}</span>
            {item.color ? <span className="ml-1 font-semibold text-pink-600">· {String(item.color)}</span> : null}
          </div>
        ))}
      </div>

      {editing && (
        <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-2">
          <Input value={draft.customer_name} onChange={(event) => setDraft({ ...draft, customer_name: event.target.value })} placeholder="Nom du client" />
          <Input value={draft.customer_phone} onChange={(event) => setDraft({ ...draft, customer_phone: event.target.value })} placeholder="Téléphone" />
          <Input value={draft.wilaya} onChange={(event) => setDraft({ ...draft, wilaya: event.target.value })} placeholder="Wilaya" />
          <select value={draft.delivery_method} onChange={(event) => setDraft({ ...draft, delivery_method: event.target.value })} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm">
            <option value="domicile">Livraison à domicile</option>
            <option value="bureau">Livraison au bureau</option>
          </select>
          <Input value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} placeholder="Adresse" className="md:col-span-2" />
          <Textarea value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} placeholder="Note de commande" className="md:col-span-2" />
          <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as OrderStatus })} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold">
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="cancelled">Annulée</option>
          </select>
          <Button type="button" disabled={saving} onClick={save} className="h-11 rounded-xl bg-pink-600 hover:bg-pink-700">
            {saving ? "Enregistrement..." : "Enregistrer la commande"}
          </Button>
        </div>
      )}
    </article>
  );
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
