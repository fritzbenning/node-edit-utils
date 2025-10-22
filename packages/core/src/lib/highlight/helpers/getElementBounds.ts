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
  
    const top = Math.round(relativeTop) / (window.canvas?.zoom.current ?? 1);
    const left = Math.round(relativeLeft) / (window.canvas?.zoom.current ?? 1);
    const width = Math.round(elementRect.width) / (window.canvas?.zoom.current ?? 1);
    const height = Math.round(elementRect.height) / (window.canvas?.zoom.current ?? 1);
  
    return {
      top,
      left,
      width,
      height,
    };
  }