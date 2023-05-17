import { RefObject, useEffect } from "react";

/** Attaches an event listener to window. TODO: extend to support  */
export default function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (event: WindowEventMap[K]) => void
): void;
export default function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement
>(
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<T>,
  opts?: boolean | AddEventListenerOptions
): void;
export default function useEventListener<K extends keyof DocumentEventMap>(
  event: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: RefObject<Document>,
  opts?: boolean | AddEventListenerOptions
): void;
export default function useEventListener<
  KW extends keyof WindowEventMap,
  KE extends keyof HTMLElementEventMap,
  T extends HTMLElement | void = void
>(
  event: KW | KE,
  listener: (event: any) => void,
  elm?: RefObject<T>,
  opts?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    const target: T | Window = elm?.current || window;
    if (!target) {
      return;
    }
    target.addEventListener(event, listener, opts);
    return () => {
      target.removeEventListener(event, listener, opts);
    };
  }, [event, elm, listener, opts]);
}
