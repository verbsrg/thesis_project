import { buttonVariants } from "@/components/ui/button";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  let errorMessage: string;
  if (isRouteErrorResponse(error)) {
    errorMessage = error.data.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Neznámá chyba";
  }

  return (
    <div
      id="error-page"
      className="flex flex-col space-y-2 justify-center items-center h-screen"
    >
      <h1 className="text-4xl font-bold">Jejda!</h1>
      <p>Něco se pokazilo...</p>
      <i className="text-zinc-500 py-5">{errorMessage}</i>
      <Link to="/" className={buttonVariants({ variant: "secondary" })}>
        Zpět na hlavní stránku
      </Link>
    </div>
  );
}
