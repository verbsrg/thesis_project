import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function RedirectPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const magicLink = queryParams.get("link");
  const type = queryParams.get("type");

  useEffect(() => {
    if (magicLink) {
      window.location.href = magicLink;
    } else {
      window.location.href = "/";
    }
  }, [magicLink]);

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <h1 className="text-2xl">
        {type === "recovery"
          ? "Přesměrování na stránku pro obnovení hesla..."
          : "Přesměrování na stránku pro přihlášení..."}
      </h1>
      <Loader2 className="animate-spin mt-4" size={32} />
    </div>
  );
}
