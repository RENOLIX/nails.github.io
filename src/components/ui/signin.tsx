import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export function SignInCard() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn(name.trim() || "Client Apple");
    navigate("/");
  }

  return (
    <div className="w-full rounded-[2rem] bg-white p-8 shadow-sm">
      <span className="mb-4 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
        Espace client
      </span>
      <h2 className="text-2xl font-semibold tracking-tight">
        Suivi rapide de votre appareil
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Entrez votre nom pour simuler un acces a votre suivi de reparation.
      </p>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-xl bg-[#f5f5f7] px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-foreground/20"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Votre nom"
          aria-label="Votre nom"
        />
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
        >
          Entrer
        </button>
      </form>
    </div>
  );
}
