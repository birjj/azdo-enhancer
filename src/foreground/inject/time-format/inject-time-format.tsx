import { InjectionConfig, reactInjection } from "../utils";
import console from "../../../shared/log";

type AugmentedHTMLTimeElement = HTMLTimeElement & {
  ___timeAugmented?: boolean;
};
const augmentTimeText = ($elm: AugmentedHTMLTimeElement) => {
  if ($elm.___timeAugmented) {
    return;
  }
  const date = new Date($elm.dateTime);
  if (isNaN(+date)) {
    console.warn("Failed to parse time for", $elm);
    return;
  }
  const strHours = date.getHours().toString().padStart(2, "0");
  const strMinutes = date.getMinutes().toString().padStart(2, "0");
  if (!/ago/.test($elm.textContent || "")) {
    const $old = document.createElement("span");
    $old.textContent = ` (${$elm.textContent})`;
    $old.classList.add("secondary-text");
    $elm.appendChild($old);
  }

  $elm.childNodes[0].textContent = `${strHours}:${strMinutes}`;

  $elm.___timeAugmented = true;
};

const iTimeFormat: InjectionConfig = {
  selector: `time[datetime]`,
  mount: ($elm) => {
    if ($elm.nodeName !== "TIME" || $elm.childNodes[0]?.nodeName !== "#text") {
      console.warn("Not augmenting <time>", $elm);
      return;
    }

    augmentTimeText($elm as HTMLTimeElement);
  },
  unmount: ($elm) => {
    if ("___timeAugmented" in $elm) {
      delete $elm.___timeAugmented;
    }
  },
};
export default iTimeFormat;
