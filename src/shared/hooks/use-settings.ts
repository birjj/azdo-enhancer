import { useCallback, useState } from "react";
import useStorage from "./use-storage";
import { SETTINGS, storageKeyFromName } from "../settings";

export const useSetting = (key: keyof typeof SETTINGS) => {
  const { value, updateValue, isPersisted } = useStorage(
    storageKeyFromName(key),
    SETTINGS[key].default,
    () => {},
    "local"
  );

  return {
    value,
    setValue: updateValue,
    isPersisted,
  };
};
