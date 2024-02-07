import React, { useCallback, useRef, useState } from "react";
import { reactInjection } from "../utils";

import style from "./inject-search-phrases.module.css";
import { getSettingValue } from "../../../shared/settings";
import * as Popover from "@radix-ui/react-popover";
import useStorage from "../../../shared/hooks/use-storage";

const timeoutPromise = (duration: number) =>
  new Promise((res) => setTimeout(res, duration));

const performSearch = async (phrase: string) => {
  const searchInputSelector = ".log-header .find-area.active input";
  let $searchInput: HTMLInputElement | null =
    document.querySelector(searchInputSelector);
  if (!$searchInput) {
    const $searchBtn = document.querySelector(
      "#__bolt-log-search"
    ) as HTMLElement | null;
    if (!$searchBtn) {
      console.warn(
        "Couldn't open search, since we couldn't find the search button"
      );
      return;
    }
    $searchBtn.click();
  }
  for (let i = 0; i < 10; ++i) {
    $searchInput = document.querySelector(searchInputSelector);
    if (!$searchInput) {
      await timeoutPromise(50);
    }
  }
  if (!$searchInput) {
    console.warn("Couldn't find the search input for searching");
    return;
  }

  const alreadyHasValue = $searchInput.value === phrase;
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  )!.set;
  nativeSetter?.call($searchInput, phrase);
  if (alreadyHasValue) {
    const event = new KeyboardEvent("keydown", {
      code: "Enter",
      key: "Enter",
      charCode: 13,
      keyCode: 13,
      view: window,
      bubbles: true,
    });
    $searchInput.dispatchEvent(event);
  } else {
    $searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  }
};

const SearchPhrasesMenu = () => {
  const {
    isPersisted,
    value: phrases,
    updateValue: setPhrases,
  } = useStorage<string[]>("log-search-phrases", []);

  const $inputRef = useRef<HTMLInputElement>(null);
  const addPhrase = () => {
    if (!isPersisted) {
      return;
    }
    const phrase = $inputRef.current?.value;
    if (!phrase) {
      return;
    }
    setPhrases([...new Set([...phrases, phrase])]);
  };
  const deletePhrase = (phrase: string) => {
    if (!isPersisted) {
      return;
    }
    setPhrases(phrases.filter((v) => v !== phrase));
  };

  return (
    <div className={`bolt-menu bolt-list ${style.list}`} role="menu">
      {phrases.map((phrase) => (
        <span
          className={`subtle cursor-pointer ${style.entry}`}
          role="menuitem"
          tabIndex={0}
          key={phrase}
          title={`Search for '${phrase}'`}
          onClick={() => performSearch(phrase)}
        >
          <span style={{ textOverflow: "ellipsis", overflowX: "hidden" }}>
            {phrase}
          </span>
          <button
            className={`subtle bolt-button bolt-icon-button enabled icon-only bolt-focus-treatment ${style["entry-btn"]}`}
            title={`Delete phrase '${phrase}'`}
            onClick={(e) => {
              e.stopPropagation();
              deletePhrase(phrase);
            }}
          >
            <span className="fluent-icons-enabled">
              <span
                aria-hidden="true"
                className="left-icon flex-noshrink fabric-icon ms-Icon--Cancel small"
              ></span>
            </span>
          </button>
        </span>
      ))}
      <form
        className={`${style.entry}`}
        role="menuitem"
        onSubmit={(e) => {
          e.preventDefault();
          addPhrase();
        }}
      >
        <div className="bolt-textfield bolt-textfield-inline flex flex-grow">
          <input
            type="text"
            placeholder="Add new phrase..."
            className="bolt-textfield-input flex-grow"
            ref={$inputRef}
          />
          <button
            className="subtle bolt-button bolt-icon-button enabled icon-only bolt-focus-treatment"
            title="Add phrase"
            type="submit"
          >
            <span className="fluent-icons-enabled">
              <span
                aria-hidden="true"
                className="left-icon flex-noshrink fabric-icon ms-Icon--Add small"
              ></span>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

const SearchPhrasesBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          aria-label="Search phrases"
          title="Search phrases"
          aria-roledescription="button"
          className="subtle bolt-header-command-item-button bolt-button bolt-icon-button enabled icon-only bolt-focus-treatment"
          data-is-focusable="true"
          role="menuitem"
          tabIndex={0}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="2 2 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
            strokeLinejoin="round"
            className="lucide lucide-text-search"
          >
            <path d="M21 6H3" />
            <path d="M10 12H3" />
            <path d="M10 18H3" />
            <circle cx="17" cy="15" r="3" />
            <path d="m21 19-1.9-1.9" />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={`bolt-callout-shadow bolt-callout-content depth-8 ${style.menu}`}
          align="end"
        >
          <SearchPhrasesMenu />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const iLogsSearchPhrases = reactInjection(
  `.log-reader`,
  ($elm) => {
    const $parent = $elm.parentElement?.querySelector(
      ".log-header > .flex-row > .reader-actions > .reader-actions"
    );
    const $container = document.createElement("div");
    $container.classList.add("react-root");
    $container.classList.add(style.root);
    $parent?.appendChild($container);
    return $container;
  },
  () => <SearchPhrasesBtn />,
  async () => {
    const setting = await getSettingValue("logs-search-phrases");
    return setting;
  }
);
export default iLogsSearchPhrases;
