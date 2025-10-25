export function getElementBounds(
  element: Element,
  nodeProvider: HTMLElement
): {
  top: number;
  left: number;
  width: number;
  height: number;
} {
  const elementRect = element.getBoundingClientRect();
  const componentRootRect = nodeProvider.getBoundingClientRect();

  const relativeTop = elementRect.top - componentRootRect.top;
  const relativeLeft = elementRect.left - componentRootRect.left;

  const top = parseFloat((relativeTop / (window.canvas?.zoom.current ?? 1)).toFixed(5));
  const left = parseFloat((relativeLeft / (window.canvas?.zoom.current ?? 1)).toFixed(5));
  const width = parseFloat((elementRect.width / (window.canvas?.zoom.current ?? 1)).toFixed(5));
  const height = parseFloat((elementRect.height / (window.canvas?.zoom.current ?? 1)).toFixed(5));

  return {
    top,
    left,
    width,
    height,
  };
}
