import { useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const getStoredValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Failed to fetch key ${key} from LocalStorage`, error);
      return initialValue;
    }
  };}