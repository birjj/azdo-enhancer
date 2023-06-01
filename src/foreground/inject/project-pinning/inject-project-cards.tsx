import React from "react";
import usePinnedProjectsStore, { PinnedProject } from "./store";
import { reactInjection } from "../utils";
import style from "./inject-project-cards.module.css";

export const ProjectPinBtn = ({ project }: { project: PinnedProject }) => {
  const { projects, pinProject, unpinProject } = usePinnedProjectsStore();
  const isPinned = !!projects[project.url];
  return (
    <button
      className={`bolt-button bolt-link-button enabled bolt-focus-treatment ${
        isPinned ? "primary" : "subtle"
      } ${style["pin-btn"]}`}
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

const iPinProjectCard = reactInjection(
  `.project-card > div > div > .project-link`,
  ($elm) => {
    const $container = document.createElement("div");
    $container.classList.add("react-root");
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
export default iPinProjectCard;
