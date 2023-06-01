import console from "../../shared/log";
import { InjectedHTMLElement, InjectionConfig } from "./utils";

export default class InjectionObserver {
  #observer: MutationObserver;
  #injections: InjectionConfig[];
  #observed: Set<InjectedHTMLElement> = new Set();

  constructor(injections: InjectionConfig[]) {
    this.onMutations = this.onMutations.bind(this);
    this.attach = this.attach.bind(this);
    this.detach = this.detach.bind(this);

    this.#injections = injections;
    this.#observer = new MutationObserver(this.onMutations);
    this.#observer.observe(document.documentElement || document.body, {
      subtree: true,
      childList: true,
    });
    this.attach(document.documentElement || document.body);
  }
  disconnect() {
    this.#observer.disconnect();
  }

  attach($elm: HTMLElement) {
    this.#injections.forEach((config) => {
      const { selector, mount } = config;
      const $elms: InjectedHTMLElement[] = Array.from(
        $elm.querySelectorAll ? $elm.querySelectorAll(selector) : []
      );
      if ($elm.matches && $elm.matches(selector)) {
        $elms.push($elm);
      }
      $elms.forEach(($elm) => {
        if (!$elm.___attached) {
          Object.defineProperty($elm, "___attached", {
            value: new Set([config]),
            enumerable: false,
            configurable: true,
          });
          mount($elm);
          this.#observed.add($elm);
        } else if (!$elm.___attached.has(config)) {
          $elm.___attached.add(config);
          mount($elm);
        }
      });
    });
  }

  detach($elm: HTMLElement) {
    this.#observed.forEach(($mounted) => {
      if (!$mounted.___attached) {
        return;
      }
      if ($elm.contains($mounted)) {
        $mounted.___attached.forEach((config) => config.unmount?.($mounted));
        this.#observed.delete($mounted);
        delete $mounted.___attached;
      }
    });
  }

  onMutations(records: MutationRecord[]) {
    const start = performance.now();
    records.forEach((record) => {
      record.removedNodes.forEach(this.detach);
      record.addedNodes.forEach(this.attach);
    });
    const time = performance.now() - start;
    if (time > 5) {
      console.warn("Mutations processing took", time, "ms");
    }
  }
}
