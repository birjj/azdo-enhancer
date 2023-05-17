import React, { useCallback, useEffect, useRef, useState } from "react";

export const useDebouncedEffect = <T>(
  func: React.EffectCallback,
  deps?: React.DependencyList,
  time = 250
) => {
  const timeout = useRef(0);
  useEffect(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(func, time);
  }, deps);
};

export const useDebouncedMemo = <T>(
  factory: () => T,
  deps?: React.DependencyList,
  time = 250
) => {
  const [current, setCurrent] = useState(() => factory());
  useDebouncedEffect(
    () => {
      setCurrent(factory());
    },
    deps,
    time
  );
  return current;
};

export const useDebouncedCallback = <T extends (...args: any) => any>(
  callback: T,
  deps: React.DependencyList,
  time = 250
) => {
  const timeout = useRef(0);
  return useCallback((...args: Parameters<T>) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => callback.apply(args), time);
  }, deps);
};
