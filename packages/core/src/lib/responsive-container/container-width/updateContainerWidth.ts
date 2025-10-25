import { calculateConstrainedWidth } from "./calculateConstrainedWidth";

export const updateContainerWidth = (container: HTMLElement, event: MouseEvent, startX: number, startWidth: number): void => {
  const deltaX = event.clientX - startX;
  const newWidth = calculateConstrainedWidth(startWidth, deltaX);

  container.style.setProperty("--container-width", `${newWidth}px`);
};
