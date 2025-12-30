import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as toggleClassModule from "@/lib/helpers/toggleClass";
import * as createTagLabelModule from "./createTagLabel";
import { createToolsContainer } from "./createToolsContainer";

vi.mock("@/lib/helpers/toggleClass");
vi.mock("./createTagLabel");

describe("createToolsContainer", () => {
  let node: HTMLElement;
  let highlightFrame: HTMLElement;

  beforeEach(() => {
    node = document.createElement("div");
    node.setAttribute("data-node-id", "test-node");
    highlightFrame = document.createElement("div");

    vi.mocked(toggleClassModule.toggleClass).mockImplementation(() => {});
    vi.mocked(createTagLabelModule.createTagLabel).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create node-tools element", () => {
    createToolsContainer(node, highlightFrame);

    const nodeTools = highlightFrame.querySelector(".node-tools");
    expect(nodeTools).not.toBeNull();
    expect(nodeTools?.className).toBe("node-tools");
  });

  it("should append node-tools to highlight frame", () => {
    createToolsContainer(node, highlightFrame);

    const nodeTools = highlightFrame.querySelector(".node-tools");
    expect(nodeTools?.parentNode).toBe(highlightFrame);
  });

  it("should toggle is-instance class when isInstance is true", () => {
    createToolsContainer(node, highlightFrame, true, false);

    expect(toggleClassModule.toggleClass).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      "is-instance",
      true
    );
  });

  it("should toggle is-text-edit class when isTextEdit is true", () => {
    createToolsContainer(node, highlightFrame, false, true);

    expect(toggleClassModule.toggleClass).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      "is-text-edit",
      true
    );
  });

  it("should toggle both classes when both flags are true", () => {
    createToolsContainer(node, highlightFrame, true, true);

    expect(toggleClassModule.toggleClass).toHaveBeenCalledTimes(2);
  });

  it("should not toggle classes when both flags are false", () => {
    createToolsContainer(node, highlightFrame, false, false);

    expect(toggleClassModule.toggleClass).toHaveBeenCalledTimes(2);
    expect(toggleClassModule.toggleClass).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      "is-instance",
      false
    );
    expect(toggleClassModule.toggleClass).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      "is-text-edit",
      false
    );
  });

  it("should create tag label", () => {
    createToolsContainer(node, highlightFrame);

    const nodeTools = highlightFrame.querySelector(".node-tools");
    expect(createTagLabelModule.createTagLabel).toHaveBeenCalledWith(node, nodeTools as HTMLElement);
  });

  it("should pass correct nodeTools element to createTagLabel", () => {
    createToolsContainer(node, highlightFrame);

    const nodeTools = highlightFrame.querySelector(".node-tools");
    expect(createTagLabelModule.createTagLabel).toHaveBeenCalledWith(node, nodeTools as HTMLElement);
  });
});

