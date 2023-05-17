import { proxy, ref, useSnapshot } from "valtio";
import { Match } from "../../background/search";
import { Messages, sendMessage } from "../../shared/messaging";
import { useDebouncedEffect } from "./use-debounced";

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

export const searchStore = proxy({
  shown: false,
  toggleShown: (overwrite?: boolean) => {
    searchStore.reset();
    searchStore.shown =
      overwrite === undefined ? !searchStore.shown : overwrite;
  },
  loading: false,
  error: null as null | string,
  id: 0,
  matches: ref([]) as Match[],
  reset: () => {
    searchStore.loading = false;
    searchStore.error = null;
    searchStore.id = 0;
    searchStore.matches = ref([]);
  },
  setError(e: string) {
    searchStore.loading = false;
    searchStore.error = e;
    searchStore.id = 0;
  },
  async search(
    value: string,
    options: Messages["search"]["request"]["options"]
  ) {
    searchStore.reset();
    if (!value) {
      return;
    }
    searchStore.loading = true;
    const id = Math.floor(Math.random() * 1e9);
    searchStore.id = id;
    try {
      await sendMessage(
        "search",
        {
          options,
          value,
        },
        (progress) => {
          if (searchStore.id !== id) {
            return;
          }
          searchStore.matches = ref(
            searchStore.matches
              .concat(progress.value)
              .sort((a, b) => b.score - a.score)
          );
        }
      );
    } catch (err) {
      if (searchStore.id !== id) {
        return;
      }
      searchStore.setError(err);
    }
    if (searchStore.id !== id) {
      return;
    }
    searchStore.loading = false;
  },
});

const useSearch = (query: string, debounceTime = 250) => {
  const { error, loading, matches } = useSnapshot(searchStore);
  useDebouncedEffect(
    () => {
      searchStore.search(query, { regex: false, caseSensitive: false });
    },
    [query],
    debounceTime
  );
  return { error, loading, matches };
};

export default useSearch;
