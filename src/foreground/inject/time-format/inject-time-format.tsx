import { InjectionConfig, reactInjection } from "../utils";
import console from "../../../shared/log";
import { getSettingValue } from "../../../shared/settings";

type AugmentedHTMLTimeElement = HTMLTimeElement & {
  ___timeAugmented?: string | null;
  ___timeObserver?: MutationObserver;
};
const augmentTimeText = ($elm: AugmentedHTMLTimeElement) => {
  if ($elm.nodeName !== "TIME" || $elm.childNodes[0]?.nodeName !== "#text") {
    console.warn("Not augmenting <time>", $elm);
    return;
  }
  if (
    "___timeAugmented" in $elm &&
    $elm.textContent === $elm.___timeAugmented
  ) {
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

  $elm.___timeAugmented = $elm.textContent;
  if (!$elm.___timeObserver) {
    $elm.___timeObserver = new MutationObserver(() => augmentTimeText($elm));
    $elm.___timeObserver.observe($elm, {
      childList: true,
      characterData: true,
    });
  }
};

const iTimeFormat: InjectionConfig = {
  selector: `time[datetime]`,
  mount: ($elm) => {
    augmentTimeText($elm as HTMLTimeElement);
  },
  unmount: ($elm) => {
    if ("___timeObserver" in $elm) {
      ($elm as AugmentedHTMLTimeElement).___timeObserver?.disconnect();
      delete ($elm as AugmentedHTMLTimeElement).___timeObserver;
      delete ($elm as AugmentedHTMLTimeElement).___timeAugmented;
    }
  },
  gate: async () => {
    const setting = await getSettingValue("time-format");
    return setting;
  },
};
export default iTimeFormat;
