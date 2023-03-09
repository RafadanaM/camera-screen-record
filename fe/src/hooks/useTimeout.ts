/* eslint-disable consistent-return */
import { useEffect, useRef } from "react";

function useTimeout(callback: VoidFunction, delay = 500) {
  const callbackRef = useRef<VoidFunction | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay < 0) return;

    const id = setTimeout(() => {
      if (callbackRef.current) {
        callbackRef.current();
      }
    }, delay);
    return () => clearTimeout(id);
  }, [delay]);
}

export default useTimeout;
