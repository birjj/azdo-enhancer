import React from "react";
import { createRoot } from "react-dom/client";

import style from "./style.module.css";
import { LogoIcon } from "./components/LogoIcon";
import { SettingsRow } from "./components/SettingsRow";
import { SETTINGS } from "../shared/settings";

const PopupApp = () => {
  return (
    <>
      <h1>
        <LogoIcon size="1em" style={{ marginInlineEnd: "0.5ch" }} /> Settings
      </h1>
      <div className={style.card}>
        <div className={style.list}>
          {Object.keys(SETTINGS).map((k: keyof typeof SETTINGS) => {
            return <SettingsRow name={k} key={k} />;
          })}
        </div>
      </div>
    </>
  );
};

const root = createRoot(document.getElementById("app")!);
root.render(<PopupApp />);
