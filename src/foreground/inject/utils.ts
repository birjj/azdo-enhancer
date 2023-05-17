import { createRoot } from "react-dom/client";

export type InjectedHTMLElement = HTMLElement & {
  ___attached?: InjectionConfig;
  ___reactRoot?: ReturnType<typeof createRoot>;
};

export type InjectionConfig = {
  selector: string;
  mount: ($elm: InjectedHTMLElement) => void;
  unmount?: ($elm: InjectedHTMLElement) => void;
};

/** Utility function to ease the writing of attaching a React root */
export function reactInjection(
  selector: string,
  rootGenerator: ($elm: HTMLElement) => InjectedHTMLElement,
  elm: React.ReactNode
): InjectionConfig {
  return {
    selector,
    mount: ($elm) => {
      const $container = rootGenerator($elm);
      const root = createRoot($container);
      Object.defineProperty($elm, "___reactRoot", {
        enumerable: false,
        value: root,
      });
      root.render(elm);
    },
    unmount: ($elm) => {
      if (!$elm.___reactRoot) {
        return;
      }
      $elm.___reactRoot.unmount();
    },
  };
}
