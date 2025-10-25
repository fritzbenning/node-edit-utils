import { RESIZE_FACTOR } from "../constants";
import { calculateConstrainedWidth } from "./calculateConstrainedWidth";

export const updateContainerWidth = (container: HTMLElement, event: MouseEvent, startX: number, startWidth: number): void => {
  const deltaX = event.clientX - startX;
  const newWidth = calculateConstrainedWidth(startWidth, deltaX * RESIZE_FACTOR);

  container.style.setProperty("--container-width", `${newWidth}px`);
};
