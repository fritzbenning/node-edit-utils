import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { RESIZE_PRESETS } from "../constants";
import { updateActivePreset } from "./updateActivePreset";

describe("updateActivePreset", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should add is-active class to matching preset button", () => {
    const presets = document.createElement("div");
    RESIZE_PRESETS.forEach(() => {
      const button = document.createElement("button");
      button.className = "resize-preset-button";
      presets.appendChild(button);
    });
    container.appendChild(presets);

    const mobilePreset = RESIZE_PRESETS[0];
    updateActivePreset(container, mobilePreset.rawValue);

    const buttons = container.querySelectorAll<HTMLButtonElement>(".resize-preset-button");
    expect(buttons[0].classList.contains("is-active")).toBe(true);
  });

  it("should remove is-active class from non-matching buttons", () => {
    const presets = document.createElement("div");
    RESIZE_PRESETS.forEach(() => {
      const button = document.createElement("button");
      button.className = "resize-preset-button";
      presets.appendChild(button);
    });
    container.appendChild(presets);

    const buttons = container.querySelectorAll<HTMLButtonElement>(".resize-preset-button");
    buttons[0].classList.add("is-active");
    buttons[1].classList.add("is-active");

    const tabletPreset = RESIZE_PRESETS[1];
    updateActivePreset(container, tabletPreset.rawValue);

    expect(buttons[0].classList.contains("is-active")).toBe(false);
    expect(buttons[1].classList.contains("is-active")).toBe(true);
  });

  it("should handle width that doesn't match any preset", () => {
    const presets = document.createElement("div");
    RESIZE_PRESETS.forEach(() => {
      const button = document.createElement("button");
      button.className = "resize-preset-button";
      presets.appendChild(button);
    });
    container.appendChild(presets);

    const buttons = container.querySelectorAll<HTMLButtonElement>(".resize-preset-button");
    buttons[0].classList.add("is-active");

    updateActivePreset(container, 999);

    buttons.forEach((button) => {
      expect(button.classList.contains("is-active")).toBe(false);
    });
  });

  it("should handle empty container", () => {
    expect(() => {
      updateActivePreset(container, 100);
    }).not.toThrow();
  });

  it("should handle container with fewer buttons than presets", () => {
    const presets = document.createElement("div");
    // Create only 2 buttons when there are 5 presets
    for (let i = 0; i < 2; i++) {
      const button = document.createElement("button");
      button.className = "resize-preset-button";
      presets.appendChild(button);
    }
    container.appendChild(presets);

    expect(() => {
      updateActivePreset(container, RESIZE_PRESETS[0].rawValue);
    }).not.toThrow();
  });
});
