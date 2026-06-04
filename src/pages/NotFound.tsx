import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-xl rounded-3xl border border-border bg-white p-10 text-center shadow-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Erreur 404
        </p>
        <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">
          Cette page n&apos;existe pas.
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          Revenez à l&apos;accueil pour découvrir les produits Nailsy Magic.
        </p>
        <Link
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          to="/"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
