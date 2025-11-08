export const isLocked = (node: HTMLElement | null): boolean => {
  return node?.classList.contains("select-none") ?? false;
};

