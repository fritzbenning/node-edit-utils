import { RESIZE_PRESETS } from "../constants";

export const createResizePresets = (
  resizeHandle: HTMLElement,
  container: HTMLElement,
  updateWidth: (container: HTMLElement, width: number) => void
): HTMLElement => {
  const presets = document.createElement("div");
  presets.className = "resize-presets";

  RESIZE_PRESETS.forEach((preset) => {
    const button = document.createElement("button");
    button.textContent = preset.name;
    button.className = "resize-preset-button";
    button.addEventListener("click", () => {
      updateWidth(container, preset.rawValue);
    });
    presets.appendChild(button);
  });

  resizeHandle.appendChild(presets);

  return presets;
};
