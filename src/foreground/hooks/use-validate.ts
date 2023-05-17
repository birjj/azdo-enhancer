import { useEffect, useState } from "react";
import { ValidationResult } from "../../background/validate";
import {
  addBroadcastListener,
  removeBroadcastListener,
  sendMessage,
} from "../../shared/messaging";

export default function useValidate(id: string | undefined) {
  const [result, setResult] = useState<ValidationResult | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      return;
    }

    const listener = async () => {
      setLoading(true);
      try {
        const resp = await sendMessage("validateFlow", { value: id });
        setResult(resp.value);
        setError(undefined);
      } catch (e) {
        setResult(undefined);
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
