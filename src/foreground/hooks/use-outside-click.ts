import { RefObject } from "react";
import useEventListener from "./use-event-listener";

/** Attaches an event listener for clicks outside of a ref component */
export default function useOutsideClick<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (ev: MouseEvent) => void
) {
  useEventListener("mousedown", (ev) => {
    const $elm = ref?.current;
    if (!$elm || $elm.contains(ev.target as Node)) {
      return;
    }
    handler(ev);
  });
}
