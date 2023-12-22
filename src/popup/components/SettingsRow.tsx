import React, { useId, useState } from "react";
import { ToggleInput } from "./ToggleInput";

import style from "./SettingsRow.module.css";
import { useSetting } from "../../shared/hooks/use-settings";
import { SETTINGS } from "../../shared/settings";

type SettingsRowProps = {
  name: keyof typeof SETTINGS;
};
export const SettingsRow = ({ name }: SettingsRowProps) => {
  const id = useId();
  const { value, setValue, isPersisted } = useSetting(name);
  const { title, description } = SETTINGS[name];

  return (
    <label htmlFor={id} className={style.row}>
      <div className={style.header}>
        <label className={style.title} htmlFor={id}>
          {title}
        </label>
        <ToggleInput
          disabled={!isPersisted}
          checked={value}
          onChange={(e) => setValue(e.currentTarget.checked)}
          id={id}
          style={{ marginInlineStart: "1ch" }}
        />
      </div>
      {description && <p className={style.description}>{description}</p>}
    </label>
  );
};
