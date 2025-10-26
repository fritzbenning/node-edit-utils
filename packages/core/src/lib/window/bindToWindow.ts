export const bindToWindow = <T>(key: string, value: T): void => {
  if (typeof window !== "undefined") {
    // biome-ignore lint/suspicious/noExplicitAny: global window extension requires flexibility
    (window as any)[key] = value;
  }
};
