export const connectResizeObserver = (element: HTMLElement, handler: (entries: ResizeObserverEntry[]) => void): (() => void) => {
  const resizeObserver = new ResizeObserver((entries) => {
    handler(entries);
  });
  resizeObserver.observe(element);

  return () => {
    resizeObserver.disconnect();
  };
};