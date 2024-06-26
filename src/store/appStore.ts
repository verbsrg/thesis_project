import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/types/supabase";

interface AppState {
  databases: Tables<"databases">[];
  categories: Tables<"categories">[];
  tasks: Tables<"tasks">[];
  correctAnswers: Tables<"user_progress">[];
  selectedDatabase: Tables<"databases"> | null;
  selectedCategory: Tables<"categories"> | null;
  selectedTask: Tables<"tasks"> | null;
  dbLoading: boolean;
  catLoading: boolean;
  tasksLoading: boolean;
  dbError: string | null;
  catError: string | null;
  taskError: string | null;
  correctAnswersError: string | null;
  insertAnswerError: string | null;
}

interface AppActions {
  fetchDatabases: () => Promise<void>;
  fetchCategories: (database: Tables<"databases">) => Promise<void>;
  fetchTasks: (category: Tables<"categories">) => Promise<void>;
  insertCorrectAnswer: (userId: string, task: Tables<"tasks">) => Promise<void>;
  fetchCorrectAnswers: (userId: string) => Promise<void>;
  subscribeToCorrectAnswers: (userId: string) => () => void;
  setSelectedDatabase: (database: Tables<"databases">) => void;
  setSelectedCategory: (category: Tables<"categories">) => void;
  setSelectedTask: (task: Tables<"tasks">) => void;
}

const useAppStore = create<AppState & AppActions>((set, get) => ({
  databases: [],
  categories: [],
  tasks: [],
  correctAnswers: [],
  selectedDatabase: null,
  selectedCategory: null,
  selectedTask: null,
  dbLoading: false,
  catLoading: false,
  tasksLoading: false,
  dbError: null,
  catError: null,
  taskError: null,
  correctAnswersError: null,
  insertAnswerError: null,

  fetchDatabases: async () => {
    set({ dbLoading: true, dbError: null });
    try {
      const { data, error } = await supabase.from("databases").select("*");
      if (error) throw error;
      set({
        databases: data,
      });
      if (data.length > 0) {
        set({ selectedDatabase: data.find((db) => db.id === 1) });
      }
    } catch (error) {
      set({ dbError: (error as Error).message });
    } finally {
      set({ dbLoading: false });
    }
  },

  fetchCategories: async (database: Tables<"databases">) => {
    set({ catLoading: true, catError: null });
    const { selectedDatabase } = get();
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("database_id", database.id);
      if (error) throw error;
      set({
        categories: data,
      });
      if (data.length > 0) {
        set({
          selectedCategory: data.find(
            (cat) => cat.database_id === selectedDatabase?.id
          ),
        });
      }
    } catch (error) {
      set({ catError: (error as Error).message });
    } finally {
      set({ catLoading: false });
    }
  },

  fetchTasks: async (category: Tables<"categories">) => {
    set({ tasksLoading: true, taskError: null });
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("category_id", category.id)
        .order("id", { ascending: true });
      if (error) throw error;
      set({ tasks: data });
    } catch (error) {
      set({ taskError: (error as Error).message });
    } finally {
      set({ tasksLoading: false });
    }
  },

  fetchCorrectAnswers: async (userId: string) => {
    set({ correctAnswersError: null });
    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      set({ correctAnswers: data });
    } catch (error) {
      set({ correctAnswersError: (error as Error).message });
    }
  },

  subscribeToCorrectAnswers: (userId: string) => {
    const subscription = supabase
      .channel("public:user_progress")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_progress",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          set((state) => ({
            correctAnswers: [
              ...state.correctAnswers,
              payload.new as Tables<"user_progress">,
            ],
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },

  insertCorrectAnswer: async (userId: string, task: Tables<"tasks">) => {
    set({ insertAnswerError: null });
    try {
      const { error } = await supabase.from("user_progress").insert({
        user_id: userId,
        task_id: task.id,
        completed: true,
      });
      if (error) throw error;
    } catch (error) {
      set({ insertAnswerError: (error as Error).message });
    }
  },

  setSelectedDatabase: (database: Tables<"databases">) => {
    set({ selectedDatabase: database });
  },

  setSelectedCategory: (category: Tables<"categories">) => {
    set({ selectedCategory: category });
  },

  setSelectedTask: (task: Tables<"tasks">) => {
    set({ selectedTask: task });
  },
}));

export default useAppStore;
