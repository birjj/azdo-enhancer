import React from "react";
import usePinnedProjectsStore, { PinnedProject } from "./store";
import { reactInjection } from "../utils";
import console from "../../../shared/log";
import { ProjectPinBtn } from "./inject-project-cards";
import { getSettingValue } from "../../../shared/settings";

const iPinSidebar = reactInjection(
  `.navigation-section .navigation-element.navigation-link`,
  ($elm) => {
    const $container = document.createElement("div");
    $container.classList.add("react-root");
    $elm.appendChild($container);
    return $container;
  },
  ($elm) => {
    const $sidebar = $elm.closest(".navigation-container");
    const avatar = (
      $sidebar?.querySelector(
        ".project-item img.vss-Persona-content"
      ) as HTMLImageElement | null
    )?.src;
    const name = $sidebar
      ?.querySelector(".project-item > span.font-weight-heavy")
      ?.textContent?.trim();
    const url = ($elm as HTMLAnchorElement).href;
    const secondaryAvatar = (
      $elm
        .closest(".hub-group-container")
        ?.querySelector(".navigation-icon img") as HTMLImageElement | null
    )?.src;
    if (!name || !avatar || !url || !secondaryAvatar) {
      console.warn("Couldn't parse sidebar link", $elm);
      return null;
    }
    return <ProjectPinBtn project={{ name, avatar, url, secondaryAvatar }} />;
  },
  async () => {
    const setting = await getSettingValue("project-pinning");
    return setting;
  }
);
export default iPinSidebar;
