import { InjectionConfig } from "../utils";
import console from "../../../shared/log";
import { getSettingValue } from "../../../shared/settings";

import style from "./inject-wrap-log-lines.module.css";

type HTMLWrappingElement = HTMLElement & {
  ___isWrapping?: boolean;
  ___classWrappingObserver?: MutationObserver;
};
const toggleWrap = ($elm: HTMLElement) => {
  const $wrapper = $elm.closest(".log-reader") as HTMLElement | null;
  const $row = $elm.closest(
    ".bolt-fixed-height-list-row"
  ) as HTMLWrappingElement | null;
  const isWrap = !$row?.classList.contains(style.wrap);
  $row?.classList.toggle(style.wrap, isWrap);
  if ($row) {
    $row.___isWrapping = isWrap;
  }
  $wrapper?.style.setProperty("--wrap-width", `${$wrapper.clientWidth}px`);
};

function addWrapButton($elm: HTMLElement) {
  const $content = $elm.querySelector(".content");
  if (!$content) {
    return;
  }
  const $btn = document.createElement("button");
  $btn.classList.add(
    "fluent-icons-enabled",
    "bolt-button",
    "bolt-focus-treatment",
    "bolt-icon-button",
    "icon-only",
    style["expand-btn"]
  );
  $btn.title = "Wrap line";
  $btn.addEventListener("click", () => toggleWrap($btn));
  const $icon = document.createElement("span");
  $icon.classList.add("fabric-icon", "ms-Icon--ChevronUnfold10");
  $btn.appendChild($icon);
  $elm.prepend($btn);

  // AZDO might swap out the classes when the line loses focus
  // we observe this and manually change it back based on ___isWrapping
  const $row = $elm.closest(
    ".bolt-fixed-height-list-row"
  ) as HTMLWrappingElement | null;
  if ($row && !$row.___classWrappingObserver) {
    $row.___classWrappingObserver = new MutationObserver(() => {
      console.log("Observed change, updating", $row);
      $row.classList.toggle(style.wrap, !!$row.___isWrapping);
    });
    $row.___classWrappingObserver.observe($row, {
      attributeFilter: ["class"],
      attributes: true,
    });
  }
}

const iWrapLogLines: InjectionConfig = {
  selector: `.log-reader .bolt-fixed-height-list-row.absolute`,
  mount: ($elm) => {
    addWrapButton($elm);
  },
  unmount: ($elm) => {
    const $btn = $elm.querySelector(style["expand-btn"]);
    $btn?.parentNode?.removeChild($btn);
  },
  gate: async () => {
    const setting = await getSettingValue("wrap-log-lines");
    return setting;
  },
};
export default iWrapLogLines;
