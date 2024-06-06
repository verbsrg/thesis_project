import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EditorButtons({
  incorrectAttempts,
  showAiHelper,
  isCorrect,
  handleAiHelperClick,
  handleNextTask,
  categoryTasksEnd,
  handleRunQuery,
  runError,
  handleResultCheck,
}: {
  incorrectAttempts: number;
  showAiHelper: boolean;
  isCorrect: boolean | null;
  handleAiHelperClick: () => void;
  handleNextTask: () => void;
  categoryTasksEnd: boolean;
  handleRunQuery: () => void;
  runError: string | null;
  handleResultCheck: () => void;
}) {
  return (
    <div className="flex justify-between gap-2 mt-2 m-3">
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="disabled:cursor-not-allowed">
              <span tabIndex={0}>
                <Button
                  disabled={incorrectAttempts < 1 || showAiHelper || isCorrect!}
                  variant={"outline"}
                  onClick={handleAiHelperClick}
                >
                  AI nápověda
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {incorrectAttempts < 1
                  ? "Bude k dispozici v případě 3 po sobě jdoucích špatných odpovědí"
                  : "AI nápověda je dostupná"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {isCorrect ? (
        <Button disabled={categoryTasksEnd} onClick={handleNextTask}>
          Další uloha
        </Button>
      ) : (
        <div className="flex space-x-3">
          <Button onClick={handleRunQuery}>Spustit</Button>
          <Button disabled={!!runError} onClick={handleResultCheck}>
            Ověřit
          </Button>
        </div>
      )}
    </div>
  );
}
