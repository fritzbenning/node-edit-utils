import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { RESIZE_PRESETS } from "../constants";
import { updateWidth } from "./updateWidth";

describe("updateWidth", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should set --container-width CSS variable", () => {
    updateWidth(container, 500);
    expect(container.style.getPropertyValue("--container-width")).toBe("500px");
  });

  it("should update active preset when width matches a preset", () => {
    // Create preset buttons
    const presets = document.createElement("div");
    presets.className = "resize-presets";
    RESIZE_PRESETS.forEach(() => {
      const button = document.createElement("button");
      button.className = "resize-preset-button";
      presets.appendChild(button);
    });
    container.appendChild(presets);

    const mobilePreset = RESIZE_PRESETS[0];
    updateWidth(container, mobilePreset.rawValue);

    const buttons = container.querySelectorAll<HTMLButtonElement>(".resize-preset-button");
    expect(buttons[0].classList.contains("is-active")).toBe(true);
    expect(buttons[1].classList.contains("is-active")).toBe(false);
  });

  it("should remove active class from other presets when setting new width", () => {
    const presets = document.createElement("div");
    presets.className = "resize-presets";
    RESIZE_PRESETS.forEach(() => {
      const button = document.createElement("button");
      button.className = "resize-preset-button";
      presets.appendChild(button);
    });
    container.appendChild(presets);

    const buttons = container.querySelectorAll<HTMLButtonElement>(".resize-preset-button");
    buttons[0].classList.add("is-active");

    const tabletPreset = RESIZE_PRESETS[1];
    updateWidth(container, tabletPreset.rawValue);

    expect(buttons[0].classList.contains("is-active")).toBe(false);
    expect(buttons[1].classList.contains("is-active")).toBe(true);
  });

  it("should handle width that doesn't match any preset", () => {
    const presets = document.createElement("div");
    presets.className = "resize-presets";
    RESIZE_PRESETS.forEach(() => {
      const button = document.createElement("button");
      button.className = "resize-preset-button";
      presets.appendChild(button);
    });
    container.appendChild(presets);

    updateWidth(container, 999);

    const buttons = container.querySelectorAll<HTMLButtonElement>(".resize-preset-button");
    buttons.forEach((button) => {
      expect(button.classList.contains("is-active")).toBe(false);
    });
  });
});
