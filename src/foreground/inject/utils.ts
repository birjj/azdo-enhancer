import { createRoot } from "react-dom/client";
import { SETTINGS } from "../../shared/settings";
import { randomString } from "../../shared/utils";

export type InjectedHTMLElement = HTMLElement & {
  ___attached?: Set<InjectionConfig>;
};

export type InjectionConfig = {
  selector: string;
  mount: ($elm: InjectedHTMLElement) => void;
  unmount?: ($elm: InjectedHTMLElement) => void;
  gate?: () => Promise<boolean> | boolean;
};

export type InjectedReactElement = InjectedHTMLElement & {
  [k: `___reactRoot-${string}`]: ReturnType<typeof createRoot> | undefined;
};

/** Utility function to ease the writing of attaching a React root */
export function reactInjection(
  selector: string,
  rootGenerator: ($elm: HTMLElement) => HTMLElement,
  reactNode: ($elm: HTMLElement) => React.ReactNode,
  gate?: () => Promise<boolean> | boolean
): InjectionConfig {
  const cacheKey = `___reactRoot-${randomString(
    8
  )}` as `___reactRoot-${string}`;
  return {
    selector,
    mount: ($elm: InjectedReactElement) => {
      const $container = rootGenerator($elm);
      const root = createRoot($container);
      Object.defineProperty($elm, cacheKey, {
        enumerable: false,
        value: root,
      });
      root.render(reactNode($elm));
    },
    unmount: ($elm: InjectedReactElement) => {
      $elm[cacheKey]?.unmount();
    },
    gate,
  };
}
