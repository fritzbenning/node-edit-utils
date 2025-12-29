export const getNodeProvider = (): HTMLElement | null => {
  return document.querySelector('[data-role="node-provider"]') as HTMLElement | null;
};

