import { useState, useEffect } from "react";

/**
 * Custom Hook để trì hoãn việc cập nhật một giá trị (debounce).
 * @param {*} value - Giá trị cần trì hoãn (ví dụ: từ khóa tìm kiếm).
 * @param {number} delay - Thời gian trì hoãn (miliseconds).
 * @returns {*} Giá trị đã được trì hoãn.
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
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
