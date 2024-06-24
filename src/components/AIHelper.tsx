import { useEffect, useRef, useState } from "react";
import { InfoIcon, Loader2 } from "lucide-react";
import useAppStore from "@/store/appStore";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";

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

  const prompt = `Jste virtuální asistent v roli učitele kurzu databáze, vaši studenti se učí příkazy SQL SELECT. Postupujte podle následujících kroků: 1. Podívejte se na SQLite databáze: ${schema}. 2. Přečtěte si zadání k této databáze: ${selectedTask?.text}. 3. Přečtěte si odpověď studenta na toto zadání: ${userQuery}. 4. Nakonec studentovi krátce napovězte, proč je jeho dotaz nesprávný, ale nikdy nesdělujte správnou odpověď. Příklad odpovědi: Váš dotaz je nesprávný kvůli X a Y, zvažte Z, abyste mohli svůj dotaz opravit.`;

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
    <div className="mt-2 border rounded-lg p-3 m-3">
      <div className="flex">
        <h2 className="text-lg font-bold">AI pomocník:</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-5 w-5 ml-2" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Vždy berte v úvahu, že AI pomocník může občas vracet špatné
                nápovědy.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
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
