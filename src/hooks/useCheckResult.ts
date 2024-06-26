import { useCallback, useState } from "react";
import { Database, QueryExecResult } from "sql.js";

export function useCheckResult({
  db,
  solutionQuery,
  rowStrict,
  results,
}: {
  db: Database | null;
  solutionQuery: string | undefined;
  rowStrict: boolean | undefined;
  results: QueryExecResult | undefined;
}) {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const normalizeResults = useCallback(
    (results: QueryExecResult) => {
      if (rowStrict) {
        return results.values.map((row) => row.sort());
      }
      return results.values.map((row) => row.sort()).sort();
    },
    [rowStrict]
  );

  const checkResult = useCallback(() => {
    if (!db) {
      setError("Databáze není inicializována");
      setIsCorrect(null);
      return;
    }
    try {
      const result = db.exec(solutionQuery!);
      const solutionResults =
        result.length > 0 ? normalizeResults(result[0]) : [];
      const userResults = normalizeResults(results!);
      const isCorrect =
        JSON.stringify(solutionResults) === JSON.stringify(userResults);
      isCorrect ? setIsCorrect(true) : setIsCorrect(false);
      setError(null);
    } catch (error) {
      setError(`Vyskytla se chyba ${error}`);
      setIsCorrect(null);
    }
  }, [db, solutionQuery, normalizeResults, results]);

  const resetIsCorrect = useCallback(() => {
    setIsCorrect(null);
  }, [setIsCorrect]);

  return { checkResult, isCorrect, resetIsCorrect, error };
}
