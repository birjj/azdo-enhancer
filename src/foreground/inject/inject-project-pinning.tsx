import React from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import console from "../../shared/log";
import { reactInjection } from "./utils";

type PinnedProject = {
  url: string;
  avatar: string;
  name: string;
};

// introduce our Zustand store which we use to keep track of pinned projects
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

// add an injection for the header
const ProjectPinList = () => {
  const projects = usePinnedProjectsStore((state) => state.projects);
  return (
    <>
      {Object.keys(projects).map((k) => (
        <a
          key={k}
          href={projects[k].url}
          className="top-navigation-item"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 0.5em",
          }}
        >
          <div className="vss-Persona flex-noshrink project-persona medium">
            <img
              src={projects[k].avatar}
              className="vss-Persona-content using-image"
            />
          </div>
        </a>
      ))}
    </>
  );
};
export const projectPinListInjection = reactInjection(
  `.region-header`,
  ($elm) => {
    const $container = document.createElement("div");
    $container.classList.add("top-level-navigation");
    $container.style.display = "flex";
    $container.style.alignItems = "stretch";
    $container.style.padding = "0";
    $container.style.border = "none";

    const $nextChild = $elm.querySelector(".expandable-search-header");
    $elm.insertBefore($container, $nextChild);
    return $container;
  },
  () => <ProjectPinList />
);

// add an injection for the pin symbol
const ProjectPinBtn = ({ project }: { project: PinnedProject }) => {
  const { projects, pinProject, unpinProject } = usePinnedProjectsStore();
  const isPinned = !!projects[project.url];
  return (
    <button
      className={`bolt-button bolt-link-button enabled bolt-focus-treatment ${
        isPinned ? "primary" : ""
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        isPinned ? unpinProject(project) : pinProject(project);
      }}
    >
      <span aria-hidden="true" className="fabric-icon ms-Icon--Pinned" />
    </button>
  );
};
export const projectPinningInjection = reactInjection(
  `.project-card > div > div > .project-link`,
  ($elm) => {
    const $container = document.createElement("div");
    $elm.appendChild($container);
    return $container;
  },
  ($elm) => {
    const name = $elm.querySelector(".project-name")?.textContent?.trim();
    const avatar = (
      $elm.querySelector("img.vss-Persona-content") as HTMLImageElement | null
    )?.src;
    const url = ($elm as HTMLAnchorElement).href;
    if (!name || !avatar || !url) {
      console.warn("Couldn't parse project card", $elm);
      return null;
    }
    return <ProjectPinBtn project={{ name, avatar, url }} />;
  }
);
