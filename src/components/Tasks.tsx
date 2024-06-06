import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Documentation from "./Documentation";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { memo, useEffect } from "react";
import useAppStore from "@/store/appStore";
import { useAuth } from "@/context/AuthProvider";
import { useMediaQuery } from "react-responsive";

function Tasks() {
  const {
    fetchDatabases,
    fetchCorrectAnswers,
    databases,
    selectedDatabase,
    categories,
    selectedCategory,
    tasks,
    selectedTask,
    correctAnswers,
    dbLoading,
    catLoading,
    tasksLoading,
    setSelectedDatabase,
    setSelectedCategory,
    setSelectedTask,
  } = useAppStore();

  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const { user } = useAuth();

  useEffect(() => {
    fetchDatabases();
    fetchCorrectAnswers(user!.id);
    const unsubscribe = useAppStore
      .getState()
      .subscribeToCorrectAnswers(user!.id);
    return unsubscribe;
    // eslint-disable-next-line
  }, [fetchDatabases, fetchCorrectAnswers]);

  useEffect(() => {
    if (selectedDatabase) {
      useAppStore.getState().fetchCategories(selectedDatabase);
    }
  }, [selectedDatabase]);

  useEffect(() => {
    if (selectedDatabase && selectedCategory) {
      useAppStore.getState().fetchTasks(selectedDatabase, selectedCategory);
    }
  }, [selectedDatabase, selectedCategory]);

  const isTaskCompleted = (taskId: number) => {
    return correctAnswers.some((answer) => answer.task_id === taskId);
  };
  return (
    <div className="flex flex-col border rounded-lg p-3 my-3 lg:m-3 basis-1/3 overflow-x-hidden">
      {dbLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex justify-stretch space-x-3 mb-3">
            <Select
              onValueChange={(e) => {
                const value = databases.find((db) => db.name === e);
                if (value) {
                  setSelectedDatabase(value);
                }
              }}
              value={selectedDatabase?.name}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vyberte databáze" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {databases.map((database) => (
                    <SelectItem value={database.name} key={database.id}>
                      {database.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {catLoading ? (
              <Select>
                <SelectTrigger>
                  <Skeleton className="h-2 w-[100px]" />
                </SelectTrigger>
              </Select>
            ) : (
              <Select
                onValueChange={(e) => {
                  const value = categories.find((cat) => cat.name === e);
                  if (value) {
                    setSelectedCategory(value);
                  }
                }}
                value={selectedCategory?.name}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem value={category.name} key={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
          {isDesktop ? (
            <Tabs defaultValue="tasks">
              <TabsList className="w-full">
                <TabsTrigger value="tasks" className="w-1/2">
                  Úlohy
                </TabsTrigger>
                <TabsTrigger value="docs" className="w-1/2">
                  Dokumentace
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tasks" className="flex flex-col">
                {tasksLoading ? (
                  <div className="m-auto">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-6 content-stretch gap-3">
                    {tasks.map((task, index) => {
                      // Give tasks from each category an id from 1
                      const pseudoId = index + 1;
                      const selected = selectedTask?.id === task.id;
                      return (
                        <Button
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className={
                            isTaskCompleted(task.id)
                              ? selected
                                ? "bg-green-700 text-background hover:bg-green-800"
                                : "bg-green-500 text-background hover:bg-green-600"
                              : ""
                          }
                          variant={selected ? "default" : "secondary"}
                        >
                          {pseudoId}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="docs" className="max-w-full">
                <ScrollArea className="h-[calc(100vh-235px)] border rounded-lg p-5 pt-0">
                  <Documentation
                    markdown={
                      selectedDatabase ? selectedDatabase?.documentation : null
                    }
                  />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          ) : (
            <>
              {tasksLoading ? (
                <div className="m-auto">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : (
                <ScrollArea className="h-28 text-sm">
                  <div className="grid grid-cols-6 content-stretch gap-3">
                    {tasks.map((task, index) => {
                      // Give tasks from each category an id from 1
                      const pseudoId = index + 1;
                      const selected = selectedTask?.id === task.id;
                      return (
                        <Button
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className={
                            isTaskCompleted(task.id)
                              ? selected
                                ? "bg-green-700 text-background hover:bg-green-800"
                                : "bg-green-500 text-background hover:bg-green-600"
                              : ""
                          }
                          variant={selected ? "default" : "secondary"}
                        >
                          {pseudoId}
                        </Button>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default memo(Tasks);
