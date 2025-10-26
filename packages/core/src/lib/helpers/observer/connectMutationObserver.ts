export const connectMutationObserver = (element: HTMLElement, handler: (mutations: MutationRecord[]) => void): MutationObserver => {
  const mutationObserver = new MutationObserver((mutations) => {
    handler(mutations);
  });
  mutationObserver.observe(element, {
    subtree: true,
    childList: true,
    characterData: true,
  });

  return mutationObserver;
};
