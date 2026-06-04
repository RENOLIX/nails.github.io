import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = window.setTimeout(() => navigate("/", { replace: true }), 1200);
    return () => window.clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-svh gap-4 px-4 text-center">
      <Spinner className="size-8" />
      <p className="text-sm text-muted-foreground">Chargement...</p>
      <Button variant="secondary" onClick={() => navigate("/", { replace: true })}>
        Retour accueil
      </Button>
    </div>
  );
}
