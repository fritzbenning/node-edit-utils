import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTagLabel } from "./createTagLabel";

describe("createTagLabel", () => {
  let node: HTMLElement;
  let nodeTools: HTMLElement;

  beforeEach(() => {
    node = document.createElement("div");
    nodeTools = document.createElement("div");
    nodeTools.className = "node-tools";
    document.body.appendChild(nodeTools);
  });

  afterEach(() => {
    if (document.body.contains(nodeTools)) {
      document.body.removeChild(nodeTools);
    }
  });

  it("should create tag label with div tag name", () => {
    createTagLabel(node, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel).not.toBeNull();
    expect(tagLabel?.textContent).toBe("Container");
  });

  it("should use instance name when available", () => {
    node.setAttribute("data-instance-name", "CustomComponent");

    createTagLabel(node, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.textContent).toBe("CustomComponent");
  });

  it("should capitalize instance name", () => {
    node.setAttribute("data-instance-name", "customComponent");

    createTagLabel(node, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.textContent).toBe("CustomComponent");
  });

  it("should map h1 to Heading 1", () => {
    const h1 = document.createElement("h1");
    createTagLabel(h1, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.textContent).toBe("Heading 1");
  });

  it("should map h2 to Heading 2", () => {
    const h2 = document.createElement("h2");
    createTagLabel(h2, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.textContent).toBe("Heading 2");
  });

  it("should map p to Text", () => {
    const p = document.createElement("p");
    createTagLabel(p, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.textContent).toBe("Text");
  });

  it("should map img to Image", () => {
    const img = document.createElement("img");
    createTagLabel(img, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.textContent).toBe("Image");
  });

  it("should map a to Link", () => {
    const a = document.createElement("a");
    createTagLabel(a, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.textContent).toBe("Link");
  });

  it("should use tag name for unmapped elements", () => {
    const span = document.createElement("span");
    createTagLabel(span, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.textContent).toBe("Span");
  });

  it("should capitalize unmapped tag names", () => {
    const custom = document.createElement("custom-element");
    createTagLabel(custom, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.textContent).toBe("Custom-element");
  });

  it("should append label to nodeTools", () => {
    createTagLabel(node, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.parentNode).toBe(nodeTools);
  });

  it("should create label with correct class", () => {
    createTagLabel(node, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.className).toBe("tag-label");
  });

  it("should prioritize instance name over tag name", () => {
    node.setAttribute("data-instance-name", "MyComponent");

    createTagLabel(node, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.textContent).toBe("MyComponent");
  });

  it("should handle empty instance name", () => {
    node.setAttribute("data-instance-name", "");

    createTagLabel(node, nodeTools);

    const tagLabel = nodeTools.querySelector(".tag-label");
    expect(tagLabel?.textContent).toBe("Container");
  });
});

