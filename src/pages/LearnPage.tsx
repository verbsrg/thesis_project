import AIHelper from "@/components/AIHelper";
import ResultTable from "@/components/ResultTable";
import SqlEditor from "@/components/SqlEditor";
import Task from "@/components/Task";
import Tasks from "@/components/Tasks";
import { useCallback, useEffect, useState } from "react";
import { QueryExecResult } from "sql.js";
import useSqlJs from "@/hooks/useSqlJs";
import { useToast } from "@/components/ui/use-toast";
import { useCheckResult } from "@/hooks/useCheckResult";
import { useAuth } from "@/context/AuthProvider";
import useAppStore from "@/store/appStore";
import { useMediaQuery } from "react-responsive";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Documentation from "@/components/Documentation";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditorButtons from "@/components/EditorButtons";

export default function LearnPage() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<QueryExecResult>();
  /* Sem vypište dotaz a použijte tlačítko Spustit \nnebo kombinace Ctrl+Enter pro zobrazení výsledku. \nPro ověření spravnosti výsledku použijte tlačítko Vyhodnotit */
  const {
    selectedDatabase,
    tasks,
    selectedTask,
    setSelectedTask,
    insertCorrectAnswer,
    correctAnswers,
    dbError,
    catError,
    taskError,
  } = useAppStore();
  const [triggerCheck, setTriggerCheck] = useState<boolean>(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState<number>(0);
  const [categoryTasksEnd, setCategoryTasksEnd] = useState<boolean>(false);
  const { user } = useAuth();
  const [showAiHelper, setShowAiHelper] = useState<boolean>(false);
  const { toast } = useToast();
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const {
    runQuery,
    db,
    error: runError,
    emptyResultSet,
  } = useSqlJs(selectedDatabase?.schema);
  const {
    checkResult,
    isCorrect,
    resetIsCorrect,
    error: checkError,
  } = useCheckResult({
    db,
    solutionQuery: selectedTask?.solution,
    rowStrict: selectedTask?.row_strict,
    results,
  });

  const handleRunQuery = useCallback(async () => {
    setResults(undefined);
    const results = runQuery(query);
    if (results) setResults(results[0]);
  }, [query, runQuery]);

  // helper function for running a query with Ctrl+Enter key combination
  const onRun = useCallback(() => {
    handleRunQuery();
    return true;
  }, [handleRunQuery]);

  const handleResultCheck = useCallback(async () => {
    resetIsCorrect();
    await handleRunQuery();
    setTriggerCheck(true);
  }, [resetIsCorrect, handleRunQuery]);

  const handleNextTask = useCallback(() => {
    if (!selectedTask) return;

    const currentTaskIndex = tasks.findIndex(
      (task) => task.id === selectedTask.id
    );
    const nextTaskIndex = currentTaskIndex + 1;

    if (nextTaskIndex < tasks.length) {
      setSelectedTask(tasks[nextTaskIndex]);
    }
  }, [selectedTask, setSelectedTask, tasks]);

  const handleAiHelperClick = () => {
    setShowAiHelper(true);
  };

  // Reset state on task change
  useEffect(() => {
    setQuery("");
    setResults(undefined);
    resetIsCorrect();
    setIncorrectAttempts(0);
    setCategoryTasksEnd(false);
    setShowAiHelper(false);
  }, [tasks, selectedTask, resetIsCorrect]);

  // Set task on database change
  useEffect(() => {
    setSelectedTask(tasks[0]);
  }, [selectedDatabase, setSelectedTask, tasks]);

  // Update results for useCheckResults hook
  useEffect(() => {
    if (triggerCheck) {
      checkResult();
      setTriggerCheck(false);
    }
  }, [results, triggerCheck, checkResult]);

  // Display success or error toast
  useEffect(() => {
    if (checkError) {
      toast({
        title: "Chyba",
        description: checkError,
      });
    } else if (isCorrect !== null) {
      toast({
        title: isCorrect ? "Hurá!" : "Někde máte chybu",
        description: isCorrect ? "Výsledek správný" : "Výsledek nesprávný",
        variant: isCorrect ? "success" : "destructive",
      });
      if (isCorrect === false) {
        setIncorrectAttempts((prev) => prev + 1);
      }
    }
  }, [isCorrect, checkError, toast]);

  // Insert correct answer into db, if not already inserted
  useEffect(() => {
    if (selectedTask) {
      if (isCorrect) {
        const alreadyCorrect = correctAnswers.some(
          (answer) => answer.task_id === selectedTask.id
        );
        if (!alreadyCorrect) {
          insertCorrectAnswer(user!.id, selectedTask);
        }
      }
    }
    // eslint-disable-next-line
  }, [isCorrect]);

  // Check for last task within a category
  useEffect(() => {
    if (selectedTask) {
      const currentTaskIndex = tasks.findIndex(
        (task) => task.id === selectedTask.id
      );
      if (currentTaskIndex === tasks.length - 1) {
        setCategoryTasksEnd(true);
      } else {
        setCategoryTasksEnd(false);
      }
    }
  }, [selectedTask, tasks]);

  useEffect(() => {
    if (dbError) throw new Error(dbError);
    if (catError) throw new Error(catError);
    if (taskError) throw new Error(taskError);
  });

  return (
    <div className="flex flex-col sm:flex-row sm:h-[calc(100vh-73px)]">
      {isDesktop ? <Tasks /> : null}
      <div className={isDesktop ? "basis-1/3 max-w-[32vw]" : "basis-1/2"}>
        <Task />
        {isDesktop ? (
          <>
            <SqlEditor
              userQuery={query}
              setUserQuery={setQuery}
              onRun={onRun}
            />
            <EditorButtons
              incorrectAttempts={incorrectAttempts}
              showAiHelper={showAiHelper}
              isCorrect={isCorrect}
              handleAiHelperClick={handleAiHelperClick}
              handleNextTask={handleNextTask}
              categoryTasksEnd={categoryTasksEnd}
              handleRunQuery={handleRunQuery}
              runError={runError}
              handleResultCheck={handleResultCheck}
            />
          </>
        ) : (
          <Tabs defaultValue="editor" className=" m-3">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="tasks">Úlohy</TabsTrigger>
              <TabsTrigger value="documentation">Dokumentace</TabsTrigger>
            </TabsList>
            <TabsContent value="editor">
              <SqlEditor
                userQuery={query}
                setUserQuery={setQuery}
                onRun={onRun}
              />
              <EditorButtons
                incorrectAttempts={incorrectAttempts}
                showAiHelper={showAiHelper}
                isCorrect={isCorrect}
                handleAiHelperClick={handleAiHelperClick}
                handleNextTask={handleNextTask}
                categoryTasksEnd={categoryTasksEnd}
                handleRunQuery={handleRunQuery}
                runError={runError}
                handleResultCheck={handleResultCheck}
              />
            </TabsContent>
            <TabsContent
              forceMount
              className="data-[state=inactive]:hidden"
              value="tasks"
            >
              <Tasks />
            </TabsContent>
            <TabsContent value="documentation">
              <div className="border rounded-lg p-3 my-3">
                <ScrollArea className="h-[calc(100vh-260px)] text-sm">
                  <Documentation
                    markdown={
                      selectedDatabase ? selectedDatabase?.documentation : null
                    }
                  />
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        )}
        {showAiHelper && <AIHelper userQuery={query} />}
      </div>
      <ResultTable table={results} error={runError} isEmpty={emptyResultSet} />
    </div>
  );
}
