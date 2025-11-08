import { RESIZE_PRESETS } from "../constants";

export const updateActivePreset = (container: HTMLElement, width: number): void => {
  const presetButtons = container.querySelectorAll<HTMLButtonElement>(".resize-preset-button");
  presetButtons.forEach((button, index) => {
    if (index < RESIZE_PRESETS.length) {
      const preset = RESIZE_PRESETS[index];
      if (preset.rawValue === width) {
        button.classList.add("is-active");
      } else {
        button.classList.remove("is-active");
      }
    }
  });
};
