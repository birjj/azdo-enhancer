import React from "react";
import usePinnedProjectsStore from "./store";
import { reactInjection } from "../utils";
import style from "./inject-list.module.css";
import { getSettingValue } from "../../../shared/settings";

const ProjectPinList = () => {
  const projects = usePinnedProjectsStore((state) => state.projects);
  return (
    <div className={`top-level-navigation ${style.list}`}>
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
          <div
            className={`vss-Persona flex-noshrink project-persona small ${style["avatar-wrapper"]}`}
          >
            <img
              src={projects[k].avatar}
              className="vss-Persona-content using-image"
            />
            {projects[k].secondaryAvatar ? (
              <img
                src={projects[k].secondaryAvatar}
                className={style["secondary-avatar"]}
              />
            ) : null}
          </div>
        </a>
      ))}
    </div>
  );
};

const iPinnedList = reactInjection(
  `.region-header`,
  ($elm) => {
    const $container = document.createElement("div");
    $container.classList.add("react-root");

    const $nextChild = $elm.querySelector(".expandable-search-header");
    $elm.insertBefore($container, $nextChild);
    return $container;
  },
  () => <ProjectPinList />,
  async () => {
    const setting = await getSettingValue("project-pinning");
    return setting;
  }
);
export default iPinnedList;
