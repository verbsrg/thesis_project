import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { QueryExecResult } from "sql.js";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { memo } from "react";
import { useMediaQuery } from "react-responsive";
import { twMerge } from "tailwind-merge";

function ResultTable({
  table,
  error,
  isEmpty,
}: {
  table: QueryExecResult | undefined;
  error: string | null;
  isEmpty: boolean;
}) {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  return (
    <ScrollArea
      className={twMerge(
        isDesktop ? "basis-1/3" : "basis-1/2 overflow-auto",
        "flex justify-center items-center border rounded-lg p-1 m-3"
      )}
    >
      {error && (
        <Alert variant="destructive" className="bg-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Chyba</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {isEmpty && (
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Dotaz nevrátil žadné výsledky</AlertTitle>
        </Alert>
      )}
      {!table && !error && !isEmpty && (
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Zde budou zobrazený výsledky dotazu</AlertTitle>
        </Alert>
      )}
      {table && (
        <Table>
          <TableHeader>
            <TableRow>
              {table.columns.map((column, index) => {
                return <TableHead key={index}>{column}</TableHead>;
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.values.map((row, index) => {
              return (
                <TableRow key={index}>
                  {row.map((column, index) => {
                    return (
                      column && <TableCell key={index}>{column}</TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default memo(ResultTable);
