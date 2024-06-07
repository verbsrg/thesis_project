import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

export default function RedirectPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const magicLink = queryParams.get("link");
  const type = queryParams.get("type");

  if (magicLink) {
    return (
      <div className="flex flex-col items-center justify-center mt-4">
        <h1 className="text-2xl mb-4">Pro pokračování stiskněte tlačítko:</h1>
        {type === "recovery" ? (
          <Button>
            <a href={magicLink}>Resetovat heslo</a>
          </Button>
        ) : (
          <Button>
            <a href={magicLink}>Přihlášit se</a>
          </Button>
        )}
      </div>
    );
  } else {
    window.location.href = "/";
  }
}
