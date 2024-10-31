export const getLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    console.error(`Localstorage is not defined`);
    return null;
  }

  return localStorage.getItem(key);
};

export const setLocalStorage = (key: string, value: string) => {
  if (!key || typeof window === "undefined") {
    console.error(`Localstorage is not defined`);
    return false;
  }

  return localStorage.setItem(key, value);
};
