import { create } from "zustand";

type ClubSearchState = {
  query: string;
  setQuery: (value: string) => void;
};

export const useClubSearchStore = create<ClubSearchState>((set) => ({
  query: "",
  setQuery: (value) => set({ query: value }),
}));
