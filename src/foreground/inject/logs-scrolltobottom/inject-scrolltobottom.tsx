import React, { useCallback, useEffect, useRef, useState } from "react";
import { reactInjection } from "../utils";

import style from "./inject-scrolltobottom.module.css";
import { getSettingValue } from "../../../shared/settings";

const observeSize = ($elm: Element, callback: ResizeObserverCallback) => {
  const observer = new ResizeObserver(callback);
  observer.observe($elm);
  return () => observer.disconnect();
};

const ScrollToBottomBtn = () => {
  const btnWrapperRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  // add listeners so we can detect whether the scroll position
  useEffect(() => {
    const $parent = btnWrapperRef.current
      ?.closest(".logs-view")
      ?.querySelector(".log-reader");
    const $content = btnWrapperRef.current
      ?.closest(".logs-view")
      ?.querySelector(".reader-main-content");
    if (!$parent || !$content) {
      return;
    }

    const updateScrollState = () => {
      const toBottom =
        $parent.scrollHeight - $parent.clientHeight - $parent.scrollTop;
      setIsAtBottom(toBottom <= 24);
      setIsAtTop($parent.scrollTop <= 0);
    };

    const unobserveSize = observeSize($content, updateScrollState);
    $parent.addEventListener("scroll", updateScrollState);
    updateScrollState();
    return () => {
      unobserveSize();
      $parent.removeEventListener("scroll", updateScrollState);
    };
  }, [btnWrapperRef.current]);

  // create action callbacks
  const scrollToBottom = useCallback(() => {
    const $parent = btnWrapperRef.current
      ?.closest(".logs-view")
      ?.querySelector(".log-reader");
    if (!$parent) {
      return;
    }
    $parent.scrollTop = $parent.scrollHeight - $parent.clientHeight;
  }, [btnWrapperRef.current]);
  const scrollToTop = useCallback(() => {
    const $parent = btnWrapperRef.current
      ?.closest(".logs-view")
      ?.querySelector(".log-reader");
    if (!$parent) {
      return;
    }
    $parent.scrollTop = 0;
  }, [btnWrapperRef.current]);

  return (
    <div className="reader-actions flex-row bolt-button-group">
      <div
        className={`${
          style.button
        } reader-actions bolt-split-button flex-stretch inline-flex-row ${
          isAtBottom && isAtTop ? "hidden" : ""
        }`}
        ref={btnWrapperRef}
      >
        <button
          className={`${
            style["button-left"]
          } bolt-split-button-main bolt-split-button-option body-s bolt-button bolt-icon-button enabled icon-only bolt-focus-treatment ${
            isAtBottom ? "disabled" : ""
          }`}
          title="Scroll to bottom"
          aria-haspopup="true"
          aria-label="Scroll to bottom"
          onClick={scrollToBottom}
        >
          <span className="left-icon flex-noshrink fabric-icon ms-Icon--DoubleChevronDown" />
        </button>
        <div className="bolt-split-button-divider flex-noshrink" />
        <button
          className={`bolt-split-button-option body-s bolt-button bolt-icon-button enabled icon-only bolt-focus-treatment ${
            isAtTop ? "disabled" : ""
          }`}
          title="Scroll to top"
          onClick={scrollToTop}
        >
          <span className="left-icon flex-noshrink fabric-icon ms-Icon--DoubleChevronUp" />
        </button>
      </div>
    </div>
  );
};

const iLogsScrollToBottom = reactInjection(
  `.log-reader`,
  ($elm) => {
    const $parent = $elm.parentElement?.querySelector(
      ".log-header > .flex-row"
    );
    console.log("Inserting into", $parent, $elm.parentElement);
    const $container = document.createElement("div");
    $container.classList.add("react-root");
    $container.classList.add(style.root);
    $parent?.insertBefore($container, $parent.firstChild);
    return $container;
  },
  () => <ScrollToBottomBtn />,
  async () => {
    const setting = await getSettingValue("logs-scrolltobottom");
    return setting;
  }
);
export default iLogsScrollToBottom;
