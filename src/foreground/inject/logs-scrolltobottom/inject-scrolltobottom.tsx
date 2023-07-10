import React, { useCallback, useEffect, useRef, useState } from "react";
import { reactInjection } from "../utils";

import style from "./inject-scrolltobottom.module.css";

const observeSize = ($elm: Element, callback: ResizeObserverCallback) => {
  const observer = new ResizeObserver(callback);
  observer.observe($elm);
  return () => observer.disconnect();
};

const ScrollToBottomBtn = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const $parent = buttonRef.current?.parentElement?.parentElement;
    const $logs = $parent?.querySelector(".reader-main-content");
    if (!$parent || !$logs) {
      return;
    }

    const updateState = () => {
      const toBottom =
        $parent.scrollHeight - $parent.clientHeight - $parent.scrollTop;
      setIsScrollable(toBottom > 0);
    };
    const unobserveSize = observeSize($logs, updateState);
    $parent.addEventListener("scroll", updateState);
    return () => {
      unobserveSize();
      $parent.removeEventListener("scroll", updateState);
    };
  }, [buttonRef.current]);

  const doScroll = useCallback(() => {
    const $parent = buttonRef.current?.parentElement?.parentElement;
    if (!$parent) {
      return;
    }

    $parent.scrollTop = $parent.scrollHeight - $parent.clientHeight;
  }, [buttonRef.current]);

  return (
    <button
      className={`${
        style.button
      } bolt-button primary bolt-focus-treatment enabled ${
        isScrollable ? "" : "invisible"
      }`}
      ref={buttonRef}
      onClick={doScroll}
    >
      Scroll to bottom
    </button>
  );
};

const iLogsScrollToBottom = reactInjection(
  `.log-reader`,
  ($elm) => {
    const $container = document.createElement("div");
    $container.classList.add("react-root");
    $elm.appendChild($container);
    return $container;
  },
  () => <ScrollToBottomBtn />
);
export default iLogsScrollToBottom;
