import console from "../../../shared/log";
import { InjectionConfig } from "../utils";
import { parse as parseAnsi } from "ansicolor";

import style from "./inject-pipeline-errors.module.css";

const iFixPipelineErrors: InjectionConfig = {
  selector: `.run-details-tab-content .issues-card-content table tr:not([aria-hidden="true"])`,
  mount: ($elm) => {
    const $text = $elm.querySelector(".body-m");
    if (!$text) {
      return;
    }
    const text = $text.textContent || "";
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
          $span.classList.toggle(
            `ansi-${entry.color.name}`,
            !!entry.color.name
          );
          $span.classList.toggle(`ansi-bright`, !!entry.color.bright);
          $span.classList.toggle(`ansi-dim`, !!entry.color.dim);
        }
        return $span;
      })
    );
    $text.parentNode!.replaceChildren($container);
  },
  unmount: ($elm) => {},
};
export default iFixPipelineErrors;
