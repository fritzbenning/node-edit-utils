export const setupCanvasObserver = (callback?: (mutations: MutationRecord[]) => void): (() => void) => {
  const transformLayer = document.querySelector(".transform-layer");

  if (!transformLayer) {
    return () => {};
  }

  let rafId: number | null = null;

  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      callback?.(mutations);
      rafId = null;
    });
  });

  observer.observe(transformLayer, {
    attributes: true,
    attributeOldValue: true,
    subtree: true,
    childList: true,
  });

  return () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    observer.disconnect();
  };
};
