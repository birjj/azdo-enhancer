/**
 * @fileoverview Handles attaching to various elements as they appear and disappear from the DOM
 * Most of the logic should be handled in individual components
 */

import "./style.module.css";
import { InjectedHTMLElement, InjectionConfig } from "./utils";

import console from "../../shared/log";
import { sendMessage } from "../../shared/messaging";
import pipelineErrorsInjection from "./inject-pipeline-errors";

const INJECTIONS: InjectionConfig[] = [pipelineErrorsInjection];
const MOUNTED: Set<InjectedHTMLElement> = new Set();

/** Watches the DOM for elements being added and removed */
(function watch() {
  const observer = new MutationObserver(attach);
  observer.observe(document.documentElement || document.body, {
    subtree: true,
    childList: true,
  });
  attach();
})();

/** Reacts to element additions/removals, running relevant injections */
function attach() {
  INJECTIONS.forEach((config) => {
    const { selector, mount } = config;
    const $elm = document.querySelector(selector) as InjectedHTMLElement;
    if ($elm && !$elm.___attached) {
      console.log("Attaching to", $elm);
      Object.defineProperty($elm, "___attached", {
        value: config,
        enumerable: false,
      });
      mount($elm);
      MOUNTED.add($elm);
    }
  });

  MOUNTED.forEach(($elm: InjectedHTMLElement) => {
    if (!$elm.isConnected && $elm.___attached) {
      console.log("Detaching from", $elm);
      $elm.___attached.unmount?.($elm);
      MOUNTED.delete($elm);
    }
  });
}
