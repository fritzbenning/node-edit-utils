import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";
import { adjustForZoom } from "@/lib/helpers/adjustForZoom";

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

  const top = adjustForZoom(relativeTop, zoom);
  const left = adjustForZoom(relativeLeft, zoom);
  const width = Math.max(4, adjustForZoom(elementRect.width, zoom));
  const height = adjustForZoom(elementRect.height, zoom);

  return {
    top,
    left,
    width,
    height,
  };
}
