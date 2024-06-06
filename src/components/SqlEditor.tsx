import { sql } from "@codemirror/lang-sql";
import CodeMirror, { Prec, keymap } from "@uiw/react-codemirror";

import { useTheme } from "./theme-provider";
import { useMemo } from "react";

export default function SqlEditor({
  userQuery,
  setUserQuery,
  onRun,
}: {
  userQuery: string;
  setUserQuery: (query: string) => void;
  onRun: () => boolean;
}) {
  const { theme } = useTheme();
  const codeMirrorTheme = useMemo(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme === "dark" ? "dark" : "light";
  }, [theme]);
  const extensions = useMemo(
    () => [
      sql(),
      Prec.highest(
        keymap.of([
          {
            key: "Ctrl-Enter",
            run: onRun,
          },
        ])
      ),
    ],
    [onRun]
  );

  return (
    <div>
      <div className="mt-4 border rounded-lg p-1 my-3 lg:m-3">
        <CodeMirror
          height="30vh"
          maxWidth="590px"
          extensions={[extensions]}
          value={userQuery}
          onChange={(userQuery) => setUserQuery(userQuery)}
          theme={codeMirrorTheme}
        />
      </div>
    </div>
  );
}
