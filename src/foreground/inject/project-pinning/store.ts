import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PinnedProject = {
  url: string;
  avatar: string;
  name: string;
  secondaryAvatar?: string;
};

type PinnedProjectsStore = {
  projects: { [k: string]: PinnedProject };
  pinProject: (p: PinnedProject) => void;
  unpinProject: (p: PinnedProject) => void;
};

const usePinnedProjectsStore = create<PinnedProjectsStore>()(
  persist(
    (set, get) => ({
      projects: {},
      pinProject: (p: PinnedProject) =>
        set({
          projects: {
            ...get().projects,
            [p.url]: p,
          },
        }),
      unpinProject: (p: PinnedProject) => {
        const nextProjects = { ...get().projects };
        delete nextProjects[p.url];
        return set({ projects: nextProjects });
      },
    }),
    {
      name: "azdo-enhancer/pinned-projects-storage",
      partialize: (state) => ({ projects: state.projects }),
    }
  )
);
export default usePinnedProjectsStore;
