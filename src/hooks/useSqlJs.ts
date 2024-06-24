import { useEffect, useState, useCallback } from "react";
import initSqlJs, { Database, QueryExecResult, SqlJsStatic } from "sql.js";

type UseSqlJsResult = {
  runQuery: (query: string) => QueryExecResult[] | null;
  error: string | null;
  db: Database | null;
  emptyResultSet: boolean;
};

export function useSqlJs(initSql?: string): UseSqlJsResult {
  const [db, setDb] = useState<Database | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emptyResultSet, setEmptyResultSet] = useState<boolean>(false);

  useEffect(() => {
    if (!initSql) {
      return;
    }
    const loadDatabase = async () => {
      try {
        const SQL: SqlJsStatic = await initSqlJs({
          locateFile: () =>
            "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm",
        });
        const database = new SQL.Database();
        if (initSql) database.run(initSql);
        setDb(database);
      } catch (e) {
        // @ts-expect-error no specified error type from sql.js
        setError(`Nepovedlo se načíst databáze: ${e.message}`);
      }
    };

    loadDatabase();
  }, [initSql]);

  const runQuery = useCallback(
    (query: string) => {
      setError(null);
      setEmptyResultSet(false);
      if (!db) {
        setError("Databáze nebyla inicializována");
        return null;
      }
      const forbiddenClauses = ["DROP", "ALTER", "INSERT", "UPDATE", "DELETE"];

      if (
        forbiddenClauses.some((clause) => query.toUpperCase().includes(clause))
      ) {
        setError("Pouze SELECT dotazy jsou povolený");
        return null;
      }
      try {
        const result = db.exec(query);
        if (result && result.length > 0) {
          return result;
        } else {
          setEmptyResultSet(true);
          return null;
        }
      } catch (e) {
        // @ts-expect-error no specified error type from sql.js
        setError(`Provedení dotazu se nezdařilo: ${e.message}`);
        return null;
      }
    },
    [db]
  );

  return { runQuery, db, error, emptyResultSet };
}

export default useSqlJs;
