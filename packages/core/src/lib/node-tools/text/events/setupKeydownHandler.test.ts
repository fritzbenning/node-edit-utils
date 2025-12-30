import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as insertLineBreakModule from "../helpers/insertLineBreak";
import { setupKeydownHandler } from "./setupKeydownHandler";

vi.mock("../helpers/insertLineBreak");

describe("setupKeydownHandler", () => {
  let node: HTMLElement;

  beforeEach(() => {
    node = document.createElement("div");
    node.contentEditable = "true";
    document.body.appendChild(node);

    vi.mocked(insertLineBreakModule.insertLineBreak).mockImplementation(() => {});
  });

  afterEach(() => {
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
    vi.clearAllMocks();
  });

  it("should return cleanup function", () => {
    const cleanup = setupKeydownHandler(node);

    expect(typeof cleanup).toBe("function");
  });

  it("should call insertLineBreak on Enter key", () => {
    setupKeydownHandler(node);

    const event = new KeyboardEvent("keydown", { key: "Enter" });
    node.dispatchEvent(event);

    expect(insertLineBreakModule.insertLineBreak).toHaveBeenCalled();
  });

  it("should prevent default on Enter key", () => {
    setupKeydownHandler(node);

    const event = new KeyboardEvent("keydown", { key: "Enter", cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    node.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should stop propagation on Enter key", () => {
    setupKeydownHandler(node);

    const event = new KeyboardEvent("keydown", { key: "Enter" });
    const stopPropagationSpy = vi.spyOn(event, "stopPropagation");
    node.dispatchEvent(event);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it("should not call insertLineBreak on other keys", () => {
    setupKeydownHandler(node);

    const event = new KeyboardEvent("keydown", { key: "a" });
    node.dispatchEvent(event);

    expect(insertLineBreakModule.insertLineBreak).not.toHaveBeenCalled();
  });

  it("should remove event listener on cleanup", () => {
    const cleanup = setupKeydownHandler(node);

    cleanup();

    const event = new KeyboardEvent("keydown", { key: "Enter" });
    node.dispatchEvent(event);

    expect(insertLineBreakModule.insertLineBreak).not.toHaveBeenCalled();
  });

  it("should handle multiple Enter key presses", () => {
    setupKeydownHandler(node);

    const event1 = new KeyboardEvent("keydown", { key: "Enter" });
    const event2 = new KeyboardEvent("keydown", { key: "Enter" });
    node.dispatchEvent(event1);
    node.dispatchEvent(event2);

    expect(insertLineBreakModule.insertLineBreak).toHaveBeenCalledTimes(2);
  });
});

