import console from "../../../shared/log";
import { type InjectedHTMLElement, type InjectionConfig } from "../utils";

import style from "./inject-pullrequest-styling.module.css";

/** Takes an element containing a conventional commit message, and replaces its children with styled <span>'s */
function stylizeCommitMessage($elm: Element | null) {
  const oldTextContent = $elm?.textContent || "";
  const match = /^([a-z]+)(\([^\)]+\))?:(.+)$/.exec(oldTextContent);
  if (!$elm || !match) {
    return;
  }

  const createSpan = (content: string, className: string) => {
    const $span = document.createElement("span");
    if (className) {
      $span.classList.add(className);
    }
    $span.textContent = content;
    return $span;
  };

  const $prefix = document.createElement("span");
  $prefix.classList.add(style["cc--prefix"]);
  $prefix.appendChild(createSpan(match[1], style["cc--type"]));
  $prefix.appendChild(createSpan(match[2], style["cc--scope"]));

  const $description = createSpan(match[3], style["cc--description"]);

  $elm.replaceChildren($prefix, document.createTextNode(":"), $description);

  if ($elm.textContent !== oldTextContent) {
    console.error(
      `Incorrect commit message enhancement: should be idempotent, but turned '${oldTextContent}' into '${$elm.textContent}'`,
      match
    );
  }
}

const applyPullrequestStyling = ($elm: HTMLElement) => {
  const tags = Array.from(
    $elm.querySelectorAll(".bolt-pill .bolt-pill-content")
  ).map(($t) => $t.textContent?.trim());
  tags.forEach((tag) => {
    const cls = style[`tagged--${tag?.toLowerCase()}`];
    if (cls) {
      $elm.classList.toggle(cls, true);
    }
  });
};

type ObservedHTMLElement = InjectedHTMLElement & {
  ___pullRequestObserver?: MutationObserver;
};
const iEnhancePullrequestStyling: InjectionConfig = {
  selector: `.repos-pr-list .bolt-list-row`,
  mount: ($elm) => {
    applyPullrequestStyling($elm);

    const observer = new MutationObserver(() => {
      applyPullrequestStyling($elm);
    });
    observer.observe($elm, {
      attributes: true,
      attributeFilter: ["class"],
    });
    ($elm as ObservedHTMLElement).___pullRequestObserver = observer;
  },
  unmount: ($elm: ObservedHTMLElement) => {
    if ($elm.___pullRequestObserver) {
      $elm.___pullRequestObserver.disconnect();
    }
  },
};
export default iEnhancePullrequestStyling;
