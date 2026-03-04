import { useEffect, useState } from "react";

/**
 * Custom hook để debounce một giá trị.
 * Trả về giá trị sau khi người dùng ngừng thay đổi trong `delay` ms.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
