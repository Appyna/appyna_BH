// Utility: Logger conditionnel (seulement en dev)
const isDev = import.meta.env.DEV;

export const logger = {
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
};
