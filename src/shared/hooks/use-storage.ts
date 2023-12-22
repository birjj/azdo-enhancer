import { useCallback, useEffect, useState } from "react";

const useStorage = <T>(
  key: string,
  initialValue: T,
  onChange?: (v: T) => void,
  type: "sync" | "local" = "local"
) => {
  const [value, setValue] = useState(initialValue);
  const [isPersisted, setPersisted] = useState(false);

  useEffect(() => {
    chrome.storage[type].get([key], (result) => {
      setPersisted(true);
      if (key in result) {
        setValue(result[key]);
      }
    });
  }, [key, type, setValue, setPersisted]);
  useEffect(() => {
    const onChanged = (
      changes: { [k: string]: chrome.storage.StorageChange },
      namespace: "sync" | "local" | "managed"
    ) => {
      if (namespace !== type) {
        return;
      }
      if (key in changes) {
        const val = changes[key].newValue;
        if (onChange) {
          onChange(val);
        }
        setValue(val);
        setPersisted(true);
      }
    };

    chrome.storage.onChanged.addListener(onChanged);
    return () => chrome.storage.onChanged.removeListener(onChanged);
  }, [key, setValue, type, onChange]);

  const updateValue = useCallback(
    async (value: T) => {
      setPersisted(false);
      setValue(value);
      await chrome.storage[type].set({
        [key]: value,
      });
      setPersisted(true);
    },
    [key]
  );

  return { value, updateValue, isPersisted };
};
export default useStorage;
