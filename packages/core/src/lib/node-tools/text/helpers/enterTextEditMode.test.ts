import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NodeText } from "../types";
import { enterTextEditMode } from "./enterTextEditMode";

describe("enterTextEditMode", () => {
  let node: HTMLElement;
  let nodeProvider: HTMLElement;
  let mockText: NodeText;

  beforeEach(() => {
    node = document.createElement("div");
    nodeProvider = document.createElement("div");
    nodeProvider.setAttribute("data-role", "node-provider");

    mockText = {
      enableEditMode: vi.fn(),
      blurEditMode: vi.fn(),
      getEditableNode: vi.fn(),
      isEditing: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call enableEditMode when node and nodeProvider are provided", () => {
    enterTextEditMode(node, nodeProvider, mockText);

    expect(mockText.enableEditMode).toHaveBeenCalledWith(node, nodeProvider);
  });

  it("should not call enableEditMode when node is null", () => {
    enterTextEditMode(null as unknown as HTMLElement, nodeProvider, mockText);

    expect(mockText.enableEditMode).not.toHaveBeenCalled();
  });

  it("should not call enableEditMode when nodeProvider is null", () => {
    enterTextEditMode(node, null, mockText);

    expect(mockText.enableEditMode).not.toHaveBeenCalled();
  });

  it("should not call enableEditMode when both are null", () => {
    enterTextEditMode(null as unknown as HTMLElement, null, mockText);

    expect(mockText.enableEditMode).not.toHaveBeenCalled();
  });
});
