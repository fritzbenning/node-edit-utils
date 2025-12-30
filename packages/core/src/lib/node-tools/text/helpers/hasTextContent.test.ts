import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { hasTextContent } from "./hasTextContent";

describe("hasTextContent", () => {
  let node: HTMLElement;

  beforeEach(() => {
    node = document.createElement("div");
  });

  afterEach(() => {
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
  });

  it("should return true when node has text content", () => {
    node.textContent = "Hello World";

    const result = hasTextContent(node);

    expect(result).toBe(true);
  });

  it("should return true when node has text node child", () => {
    const textNode = document.createTextNode("Hello");
    node.appendChild(textNode);

    const result = hasTextContent(node);

    expect(result).toBe(true);
  });

  it("should return false when node has no text content", () => {
    const result = hasTextContent(node);

    expect(result).toBe(false);
  });

  it("should return false when node only has whitespace", () => {
    node.textContent = "   \n\t  ";

    const result = hasTextContent(node);

    expect(result).toBe(false);
  });

  it("should return true when node has text with whitespace", () => {
    node.textContent = "  Hello  ";

    const result = hasTextContent(node);

    expect(result).toBe(true);
  });

  it("should return false when node only has element children", () => {
    const child = document.createElement("span");
    node.appendChild(child);

    const result = hasTextContent(node);

    expect(result).toBe(false);
  });

  it("should return true when node has both text and element children", () => {
    node.textContent = "Hello";
    const child = document.createElement("span");
    node.appendChild(child);

    const result = hasTextContent(node);

    expect(result).toBe(true);
  });

  it("should return true when node has text node with content", () => {
    const textNode = document.createTextNode("Test");
    node.appendChild(textNode);

    const result = hasTextContent(node);

    expect(result).toBe(true);
  });

  it("should return false when node has empty text node", () => {
    const textNode = document.createTextNode("");
    node.appendChild(textNode);

    const result = hasTextContent(node);

    expect(result).toBe(false);
  });

  it("should return false when node has whitespace-only text node", () => {
    const textNode = document.createTextNode("   ");
    node.appendChild(textNode);

    const result = hasTextContent(node);

    expect(result).toBe(false);
  });
});
