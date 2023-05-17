import { useEffect, useState } from "react";
import {
  addBroadcastListener,
  removeBroadcastListener,
  sendMessage,
} from "../../shared/messaging";

export default function useGroupsFromFlow(id: string | undefined) {
  const [result, setResult] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      return;
    }

    const listener = async () => {
      setLoading(true);
      try {
        const resp = await sendMessage("getGroupsByFlow", { value: id });
        setResult(resp.value);
        setError(undefined);
      } catch (e) {
        setResult([]);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    listener();
    addBroadcastListener("cuestaUpdate", listener);
    return () => removeBroadcastListener("cuestaUpdate", listener);
  }, [id, setLoading, setResult]);

  return { result, loading, error };
}
