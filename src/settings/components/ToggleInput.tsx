import React from "react";
import style from "./ToggleInput.module.css";

export const ToggleInput = (props: React.HTMLProps<HTMLInputElement>) => {
  const value = props.checked ?? false;
  return (
    <label
      htmlFor={props.id}
      style={props.style}
      className={`${style.toggle} ${value ? style.enabled : ""} ${
        props.disabled ? style.disabled : ""
      }`}
    >
      <input {...props} type="checkbox" className={style.input} />
      <span className={style.thumb} />
    </label>
  );
};
