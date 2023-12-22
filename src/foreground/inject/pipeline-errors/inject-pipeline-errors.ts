import console from "../../../shared/log";
import { InjectionConfig } from "../utils";
import { parse as parseAnsi } from "ansicolor";
import linkifyElement from "linkify-element";

import style from "./inject-pipeline-errors.module.css";
import { getSettingValue } from "../../../shared/settings";

function applyAnsiToElm($target: Node) {
  const text = $target.textContent || "";
  const parsed = parseAnsi(text).spans;
  if (parsed.length <= 1) {
    return;
  }

  const $container = document.createElement("pre");
  $container.classList.add(style.pre);
  $container.replaceChildren(
    ...parsed.map((entry) => {
      const $span = document.createElement("span");
      $span.textContent = entry.text;
      $span.setAttribute("style", entry.css);
      $span.classList.toggle(`ansi-bold`, !!entry.bold);
      $span.classList.toggle(`ansi-italic`, !!entry.italic);
      if (entry.color) {
        $span.classList.toggle(`ansi-${entry.color.name}`, !!entry.color.name);
        $span.classList.toggle(`ansi-bright`, !!entry.color.bright);
        $span.classList.toggle(`ansi-dim`, !!entry.color.dim);
      }
      return $span;
    })
  );
  ($target as ParentNode).replaceChildren($container);
}

const iFixPipelineErrors: InjectionConfig = {
  selector: `.run-details-tab-content .issues-card-content table tr:not([aria-hidden="true"])`,
  mount: ($elm) => {
    const $text = $elm.querySelector(".body-m");
    if (!$text) {
      return;
    }

    applyAnsiToElm($text);
    linkifyElement($text as HTMLElement, {
      target: "_blank",
      className: `is-link ${style["inline-link"]}`,
      validate: {
        email: () => false,
        url: (value) => /^https?:\/\//.test(value),
      },
    });
  },
  unmount: ($elm) => {},
  gate: async () => {
    const setting = await getSettingValue("pipeline-errors");
    return setting;
  },
};
export default iFixPipelineErrors;
