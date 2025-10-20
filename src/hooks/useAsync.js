import { useCallback, useEffect, useRef, useState } from "react";

// Generic async hook to standardize API calls (ready for Java backend)
export default function useAsync(asyncFn, deps = [], { immediate = true } = {}) {
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      if (!mountedRef.current) return null;
      setData(result);
      return result;
    } catch (err) {
      if (!mountedRef.current) return null;
      setError(err);
      return null;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, error, data, setData, execute };
}
