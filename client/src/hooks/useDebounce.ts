import { useState, useEffect } from "react";

export const useDebounce = <T>(value: T, delay = 500) => {
  const [debounceValue, setDebounceValue] = useState<T>(value);
  const [isDebouncing,setIsDebouncing]= useState(false);
  useEffect(() => {
    setIsDebouncing(true);
    const timeout = setTimeout(() => {
      setDebounceValue(value);
      setIsDebouncing(false);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return {isDebouncing,debounceValue};
};
