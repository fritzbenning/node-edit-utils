import { RESIZE_PRESETS } from "../constants";

export const updateActivePreset = (container: HTMLElement, width: number): void => {
  console.log("updateActivePreset", width);
  const presetButtons = container.querySelectorAll<HTMLButtonElement>(".resize-preset-button");
  console.log("presetButtons", presetButtons);
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
