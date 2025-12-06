import { create } from "zustand";
import type { DiaryEntryListItem } from "@/types/diary.types";

interface DiaryState {
  entries: DiaryEntryListItem[];
  isLoading: boolean;
  error: string | null;

  setEntries: (entries: DiaryEntryListItem[]) => void;
  addEntry: (entry: DiaryEntryListItem) => void;
  updateEntry: (id: number, entry: Partial<DiaryEntryListItem>) => void;
  removeEntry: (id: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDiaryStore = create<DiaryState>((set) => ({
  entries: [],
  isLoading: false,
  error: null,

  setEntries: (entries) => set({ entries, error: null }),

  addEntry: (entry) =>
    set((state) => ({
      entries: [entry, ...state.entries],
    })),

  updateEntry: (id, updatedEntry) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      ),
    })),

  removeEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
