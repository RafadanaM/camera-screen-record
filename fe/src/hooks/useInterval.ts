/* eslint-disable consistent-return */
import { useEffect, useRef } from "react";

function useInterval(callback: VoidFunction, delay = 500) {
  const callbackRef = useRef<VoidFunction | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay < 0 || !delay) return;

    const id = setInterval(() => {
      if (callbackRef.current) {
        callbackRef.current();
      }
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
