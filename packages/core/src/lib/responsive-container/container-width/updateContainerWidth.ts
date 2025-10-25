import { calculateConstrainedWidth } from "./calculateConstrainedWidth";

export const updateContainerWidth = (container: HTMLElement, event: MouseEvent, startX: number, startWidth: number): void => {
  const zoom = parseFloat(document.body.dataset.zoom || "1");
  const deltaX = (event.clientX - startX) / zoom;
  const newWidth = calculateConstrainedWidth(startWidth, deltaX);

  container.style.setProperty("--container-width", `${newWidth}px`);
};
