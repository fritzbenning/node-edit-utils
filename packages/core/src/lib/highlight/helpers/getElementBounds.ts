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
  
    const top = (relativeTop - 1) / (window.canvas?.zoom.current ?? 1);
    const left = (relativeLeft - 1) / (window.canvas?.zoom.current ?? 1);
    const width = (elementRect.width + 2) / (window.canvas?.zoom.current ?? 1);
    const height = (elementRect.height + 2) / (window.canvas?.zoom.current ?? 1);
  
    return {
      top,
      left,
      width,
      height,
    };
  }