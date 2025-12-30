import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as sendPostMessageModule from "../../../post-message/sendPostMessage";
import { handleTextChange } from "./handleTextChange";

vi.mock("../../../post-message/sendPostMessage");

describe("handleTextChange", () => {
  let node: HTMLElement;

  beforeEach(() => {
    node = document.createElement("div");
    node.setAttribute("data-node-id", "test-node-1");
    node.textContent = "Initial text";
    document.body.appendChild(node);

    vi.mocked(sendPostMessageModule.sendPostMessage).mockImplementation(() => {});
  });

  afterEach(() => {
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
    vi.clearAllMocks();
  });

  it("should send postMessage when text content changes", () => {
    node.textContent = "Updated text";
    const mutations: MutationRecord[] = [
      {
        type: "characterData",
        target: node.firstChild!,
        addedNodes: [] as unknown as NodeList,
        removedNodes: [] as unknown as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];

    handleTextChange(node, mutations);

    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalledWith("textContentChanged", {
      nodeId: "test-node-1",
      textContent: "Updated text",
      final: false,
    });
  });

  it("should send postMessage with final flag when final is true", () => {
    node.textContent = "Final text";
    const mutations: MutationRecord[] = [];

    handleTextChange(node, mutations, true);

    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalledWith("textContentChanged", {
      nodeId: "test-node-1",
      textContent: "Final text",
      final: true,
    });
  });

  it("should not send postMessage when no text change and final is false", () => {
    const mutations: MutationRecord[] = [
      {
        type: "attributes",
        target: node,
        addedNodes: [] as unknown as NodeList,
        removedNodes: [] as unknown as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: "class",
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];

    handleTextChange(node, mutations, false);

    expect(sendPostMessageModule.sendPostMessage).not.toHaveBeenCalled();
  });

  it("should send postMessage when mutations include childList changes", () => {
    const newChild = document.createTextNode("New child");
    const mutations: MutationRecord[] = [
      {
        type: "childList",
        target: node,
        addedNodes: [newChild] as unknown as NodeList,
        removedNodes: [] as unknown as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];

    handleTextChange(node, mutations);

    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalled();
  });

  it("should send postMessage when mutations include removed nodes", () => {
    const removedChild = document.createTextNode("Removed");
    const mutations: MutationRecord[] = [
      {
        type: "childList",
        target: node,
        addedNodes: [] as unknown as NodeList,
        removedNodes: [removedChild] as unknown as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];

    handleTextChange(node, mutations);

    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalled();
  });

  it("should handle empty textContent", () => {
    node.textContent = "";
    const mutations: MutationRecord[] = [
      {
        type: "characterData",
        target: node.firstChild!,
        addedNodes: [] as unknown as NodeList,
        removedNodes: [] as unknown as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];

    handleTextChange(node, mutations);

    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalledWith("textContentChanged", {
      nodeId: "test-node-1",
      textContent: "",
      final: false,
    });
  });

  it("should handle null textContent", () => {
    node.textContent = null as unknown as string;
    const mutations: MutationRecord[] = [
      {
        type: "characterData",
        target: node.firstChild!,
        addedNodes: [] as unknown as NodeList,
        removedNodes: [] as unknown as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];

    handleTextChange(node, mutations);

    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalledWith("textContentChanged", {
      nodeId: "test-node-1",
      textContent: "",
      final: false,
    });
  });

  it("should handle missing data-node-id", () => {
    node.removeAttribute("data-node-id");
    node.textContent = "Text without id";
    const mutations: MutationRecord[] = [
      {
        type: "characterData",
        target: node.firstChild!,
        addedNodes: [] as unknown as NodeList,
        removedNodes: [] as unknown as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];

    handleTextChange(node, mutations);

    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalledWith("textContentChanged", {
      nodeId: null,
      textContent: "Text without id",
      final: false,
    });
  });
});
