export const bindToWindow = <T>(key: string, value: T): void => {
  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>)[key] = value;
  }
};
