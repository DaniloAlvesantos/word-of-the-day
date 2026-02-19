import { useState, useEffect } from "react";

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("Erro ao carregar do localStorage:", error);
    }
  }, [key]);

  const setValue = (value: T) => {
    try {
      const valueToStore = JSON.stringify(value);
      window.localStorage.setItem(key, valueToStore);
      setStoredValue(value);
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error);
    }
  };

  return [storedValue, setValue];
};
