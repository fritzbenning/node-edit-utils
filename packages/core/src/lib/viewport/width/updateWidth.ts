import { updateActivePreset } from "../resize/updateActivePreset";

export const updateWidth = (container: HTMLElement, width: number): void => {
  container.style.setProperty("--container-width", `${width}px`);
  updateActivePreset(container, width);
};
