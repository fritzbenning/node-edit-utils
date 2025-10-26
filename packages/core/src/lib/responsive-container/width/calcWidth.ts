import { calcConstrainedWidth } from "./calcConstrainedWidth";

export const calcWidth = (event: MouseEvent, startX: number, startWidth: number): number => {
  const zoom = parseFloat(document.body.dataset.zoom || "1");
  const deltaX = (event.clientX - startX) / zoom;
  const width = calcConstrainedWidth(startWidth, deltaX);

  return width;
};
