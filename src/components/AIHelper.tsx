import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import useAppStore from "@/store/appStore";

export default function AIHelper({
  userQuery,
}: {
  userQuery: string | undefined;
}) {
  const { selectedDatabase, selectedTask } = useAppStore();
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const hasFetchedResponse = useRef(false);

  // remove insert statements from schema to minimize input tokens
  const insertRegex = /^\s*INSERT\s+INTO\s+[\w\W]+?;\s*[\r\n]*/gim;
  const schema = selectedDatabase?.schema.replace(insertRegex, "");

  const prompt = `Jste učitelem databázových kurzů. Váš student musí vyřešit úlohu založenou na této databázi: ${schema}.
    Úloha je: ${
      selectedTask?.text
    }. Student zadal tento dotaz: ${userQuery}, ale správná odpověď na tuto
    úlohu je: ${selectedTask?.solution.toLowerCase()}. Vaším úkolem je poskytnout studentovi nápovědu, jak by měl svůj dotaz změnit, aby dosáhl správné odpovědi. Správnou odpověď nesdělujte.

    Poskytněte nápovědu ve formě, která studentovi pomůže najít chybu a opravit ji. Například, můžete poukázat na nesprávné části dotazu a navrhnout, jak by je mohl změnit. Používejte formát jako "Tvůj dotaz je nesprávný, protože...".`;

  useEffect(() => {
    if (hasFetchedResponse.current) return;
    const fetchHint = async () => {
      setHint("");
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/aihelper`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt }),
          }
        );

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body
          .pipeThrough(new TextDecoderStream())
          .getReader();

        let partialResponse = "";
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            setLoading(false);
          }
          for (const char of value) {
            partialResponse += char;
            setHint(partialResponse);
            await new Promise((resolve) => setTimeout(resolve, 30));
          }
        }
      } catch (error) {
        setError(`Failed to fetch hint: ${error}`);
        console.error(error);
        setLoading(false);
      }
    };

    fetchHint();
    hasFetchedResponse.current = true;
  }, [prompt]);

  return (
    <div className="mt-4 border rounded-lg p-3 m-3">
      <h2 className="text-lg font-bold">AI pomocník:</h2>
      <div className={error ? "text-red-500" : ""}>
        {loading ? (
          <div className="flex items-center">
            Přemyšlím...
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
          </div>
        ) : error ? (
          error
        ) : (
          hint
        )}
      </div>
    </div>
  );
}
