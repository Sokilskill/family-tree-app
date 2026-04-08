import { create } from "zustand";

export const useFamilyStore = create((set) => ({
  activeFamily: null,
  familyMembers: [],

  setActiveFamily: (family) => set({ activeFamily: family }),
  setMembers: (members) => set({ familyMembers: members }),
}));
