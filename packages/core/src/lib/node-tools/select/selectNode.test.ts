import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as enterTextEditModeModule from "../text/helpers/enterTextEditMode";
import type { NodeText } from "../text/types";
import * as getElementsFromPointModule from "./helpers/getElementsFromPoint";
import * as isInsideComponentModule from "./helpers/isInsideComponent";
import * as isInsideViewportModule from "./helpers/isInsideViewport";
import * as targetSameCandidatesModule from "./helpers/targetSameCandidates";
import { selectNode } from "./selectNode";

vi.mock("../text/helpers/enterTextEditMode");
vi.mock("./helpers/getElementsFromPoint");
vi.mock("./helpers/isInsideComponent");
vi.mock("./helpers/isInsideViewport");
vi.mock("./helpers/targetSameCandidates");

describe("selectNode", () => {
  let nodeProvider: HTMLElement;
  let node1: HTMLElement;
  let node2: HTMLElement;
  let mockText: NodeText;
  let mockEvent: MouseEvent;

  beforeEach(() => {
    nodeProvider = document.createElement("div");
    nodeProvider.setAttribute("data-role", "node-provider");
    document.body.appendChild(nodeProvider);

    node1 = document.createElement("div");
    node1.setAttribute("data-node-id", "node-1");
    nodeProvider.appendChild(node1);

    node2 = document.createElement("div");
    node2.setAttribute("data-node-id", "node-2");
    nodeProvider.appendChild(node2);

    mockText = {
      getEditableNode: vi.fn().mockReturnValue(null),
      enableEditMode: vi.fn(),
      blurEditMode: vi.fn(),
      isEditing: vi.fn().mockReturnValue(false),
    };

    mockEvent = new MouseEvent("click", {
      clientX: 100,
      clientY: 200,
      bubbles: true,
    });

    vi.mocked(getElementsFromPointModule.getElementsFromPoint).mockReturnValue([node1, node2]);
    vi.mocked(isInsideComponentModule.isInsideComponent).mockReturnValue(false);
    vi.mocked(isInsideViewportModule.isInsideViewport).mockReturnValue(true);
    vi.mocked(targetSameCandidatesModule.targetSameCandidates).mockReturnValue(false);
    vi.mocked(enterTextEditModeModule.enterTextEditMode).mockImplementation(() => {});
  });

  afterEach(() => {
    if (document.body.contains(nodeProvider)) {
      document.body.removeChild(nodeProvider);
    }
    vi.clearAllMocks();
  });

  it("should return null when no candidates", () => {
    vi.mocked(getElementsFromPointModule.getElementsFromPoint).mockReturnValue([]);

    const result = selectNode(mockEvent, nodeProvider, mockText);

    expect(result).toBeNull();
  });

  it("should return first candidate when clickThrough is true (metaKey)", () => {
    const event = new MouseEvent("click", {
      clientX: 100,
      clientY: 200,
      metaKey: true,
      bubbles: true,
    });

    const result = selectNode(event, nodeProvider, mockText);

    expect(result).toBe(node1);
  });

  it("should return first candidate when clickThrough is true (ctrlKey)", () => {
    const event = new MouseEvent("click", {
      clientX: 100,
      clientY: 200,
      ctrlKey: true,
      bubbles: true,
    });

    const result = selectNode(event, nodeProvider, mockText);

    expect(result).toBe(node1);
  });

  it("should enter text edit mode when clicking same node with clickThrough", () => {
    const event = new MouseEvent("click", {
      clientX: 100,
      clientY: 200,
      metaKey: true,
      bubbles: true,
    });

    // First click
    selectNode(event, nodeProvider, mockText);
    vi.clearAllMocks();

    // Second click on same node
    selectNode(event, nodeProvider, mockText);

    expect(enterTextEditModeModule.enterTextEditMode).toHaveBeenCalledWith(node1, nodeProvider, mockText);
  });

  it("should return editable node if it's in candidates", () => {
    mockText.getEditableNode = vi.fn().mockReturnValue(node1);

    const result = selectNode(mockEvent, nodeProvider, mockText);

    expect(result).toBe(node1);
  });

  it("should cycle through candidates on repeated clicks", () => {
    // First click - targetSameCandidates returns false initially, so attempt=0
    // nodeIndex = 2-1-0 = 1, should get last candidate (node2)
    const result1 = selectNode(mockEvent, nodeProvider, mockText);
    expect(result1).toBe(node2);

    // Second click - targetSameCandidates returns true, attempt increments to 1
    // nodeIndex = 2-1-1 = 0, should get first candidate (node1)
    vi.mocked(targetSameCandidatesModule.targetSameCandidates).mockReturnValue(true);
    const result2 = selectNode(mockEvent, nodeProvider, mockText);
    expect(result2).toBe(node1);

    // Third click - attempt stays at 1 (clamped at candidates.length-2=0),
    // but 1 <= 0 is false, so attempt doesn't increment further
    // nodeIndex = 2-1-1 = 0, should get first candidate again (node1)
    const result3 = selectNode(mockEvent, nodeProvider, mockText);
    expect(result3).toBe(node1);
  });

  it("should reset attempt when candidates change", () => {
    vi.mocked(targetSameCandidatesModule.targetSameCandidates).mockReturnValue(false);

    selectNode(mockEvent, nodeProvider, mockText);

    // Should start from last candidate
    expect(vi.mocked(getElementsFromPointModule.getElementsFromPoint).mock.results[0].value[1]).toBe(node2);
  });

  it("should enter text edit mode when clicking same node", () => {
    // Use a single node to ensure we select the same one
    vi.mocked(getElementsFromPointModule.getElementsFromPoint).mockReturnValue([node1]);

    // First click - select node1
    const result1 = selectNode(mockEvent, nodeProvider, mockText);
    expect(result1).toBe(node1);
    vi.clearAllMocks();

    // Second click on same node - should enter text edit mode
    vi.mocked(targetSameCandidatesModule.targetSameCandidates).mockReturnValue(true);
    const result2 = selectNode(mockEvent, nodeProvider, mockText);

    expect(result2).toBe(node1);
    expect(enterTextEditModeModule.enterTextEditMode).toHaveBeenCalledWith(node1, nodeProvider, mockText);
  });

  it("should filter out ignored DOM elements", () => {
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    vi.mocked(getElementsFromPointModule.getElementsFromPoint).mockReturnValue([svgPath, node1]);

    const result = selectNode(mockEvent, nodeProvider, mockText);

    expect(result).toBe(node1);
  });

  it("should filter out select-none elements", () => {
    node1.classList.add("select-none");
    vi.mocked(getElementsFromPointModule.getElementsFromPoint).mockReturnValue([node1, node2]);

    const result = selectNode(mockEvent, nodeProvider, mockText);

    expect(result).toBe(node2);
  });

  it("should filter out content-layer elements", () => {
    node1.classList.add("content-layer");
    vi.mocked(getElementsFromPointModule.getElementsFromPoint).mockReturnValue([node1, node2]);

    const result = selectNode(mockEvent, nodeProvider, mockText);

    expect(result).toBe(node2);
  });

  it("should filter out resize-handle elements", () => {
    node1.classList.add("resize-handle");
    vi.mocked(getElementsFromPointModule.getElementsFromPoint).mockReturnValue([node1, node2]);

    const result = selectNode(mockEvent, nodeProvider, mockText);

    expect(result).toBe(node2);
  });

  it("should filter out resize-presets elements", () => {
    node1.classList.add("resize-presets");
    vi.mocked(getElementsFromPointModule.getElementsFromPoint).mockReturnValue([node1, node2]);

    const result = selectNode(mockEvent, nodeProvider, mockText);

    expect(result).toBe(node2);
  });

  it("should filter out elements inside components", () => {
    vi.mocked(isInsideComponentModule.isInsideComponent).mockImplementation((el) => el === node1);

    const result = selectNode(mockEvent, nodeProvider, mockText);

    expect(result).toBe(node2);
  });

  it("should filter out elements not inside viewport", () => {
    vi.mocked(isInsideViewportModule.isInsideViewport).mockImplementation((el) => el === node2);

    const result = selectNode(mockEvent, nodeProvider, mockText);

    expect(result).toBe(node2);
  });

  it("should handle multiple candidates correctly", () => {
    const node3 = document.createElement("div");
    nodeProvider.appendChild(node3);
    vi.mocked(getElementsFromPointModule.getElementsFromPoint).mockReturnValue([node1, node2, node3]);

    const result = selectNode(mockEvent, nodeProvider, mockText);

    expect(result).toBe(node3); // Last candidate
  });
});
