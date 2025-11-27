import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";

export function getElementBounds(
  element: Element,
  nodeProvider: HTMLElement,
  canvasName: string = "canvas"
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

  const zoom = getCanvasWindowValue(["zoom", "current"], canvasName) ?? 1;

  const top = parseFloat((relativeTop / zoom).toFixed(5));
  const left = parseFloat((relativeLeft / zoom).toFixed(5));
  const width = Math.max(4, parseFloat((elementRect.width / zoom).toFixed(5)));
  const height = parseFloat((elementRect.height / zoom).toFixed(5));

  return {
    top,
    left,
    width,
    height,
  };
}
