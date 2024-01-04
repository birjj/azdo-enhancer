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
  ___reactRoot?: ReturnType<typeof createRoot>;
};

/** Utility function to ease the writing of attaching a React root */
export function reactInjection(
  selector: string,
  rootGenerator: ($elm: HTMLElement) => HTMLElement,
  reactNode: ($elm: HTMLElement) => React.ReactNode,
  gate?: () => Promise<boolean> | boolean
): InjectionConfig {
  const id = randomString(8);
  return {
    selector,
    mount: ($elm: InjectedReactElement) => {
      const $container = rootGenerator($elm);
      const root = createRoot($container);
      Object.defineProperty($elm, `___reactRoot-${id}`, {
        enumerable: false,
        value: root,
      });
      root.render(reactNode($elm));
    },
    unmount: ($elm: InjectedReactElement) => {
      if (!$elm.___reactRoot) {
        return;
      }
      $elm.___reactRoot.unmount();
    },
    gate,
  };
}
