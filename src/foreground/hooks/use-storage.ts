import { useCallback, useEffect, useState } from "react";

const useStorage = <T>(
  key: string,
  initialValue: T,
  onChange?: (v: T) => void,
  type: "sync" | "local" = "local"
): [T, (v: T) => void] => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    chrome.storage[type].get([key], (result) => {
      if (key in result) {
        setValue(result[key]);
      }
    });
  }, [key, type, setValue]);
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
      }
    };

    chrome.storage.onChanged.addListener(onChanged);
    return () => chrome.storage.onChanged.removeListener(onChanged);
  }, [key, setValue, type, onChange]);

  const updateValue = useCallback(
    (value: T) => {
      chrome.storage[type].set({
        [key]: value,
      });
      setValue(value);
    },
    [key]
  );

  return [value, updateValue];
};
export default useStorage;
