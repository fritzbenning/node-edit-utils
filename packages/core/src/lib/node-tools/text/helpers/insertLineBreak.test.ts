import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { insertLineBreak } from "./insertLineBreak";

describe("insertLineBreak", () => {
  let node: HTMLElement;

  beforeEach(() => {
    node = document.createElement("div");
    node.textContent = "Hello World";
    document.body.appendChild(node);
  });

  afterEach(() => {
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
  });

  it("should insert br element at cursor position", () => {
    const range = document.createRange();
    const selection = window.getSelection();

    range.setStart(node.firstChild!, 5);
    range.setEnd(node.firstChild!, 5);
    selection?.removeAllRanges();
    selection?.addRange(range);

    insertLineBreak();

    expect(node.innerHTML).toContain("<br>");
  });

  it("should delete contents at cursor position before inserting br", () => {
    const range = document.createRange();
    const selection = window.getSelection();

    range.setStart(node.firstChild!, 5);
    range.setEnd(node.firstChild!, 11); // Select "World"
    selection?.removeAllRanges();
    selection?.addRange(range);

    insertLineBreak();

    expect(node.innerHTML).toContain("<br>");
    expect(node.textContent).not.toContain("World");
  });

  it("should move cursor after the br element", () => {
    const range = document.createRange();
    const selection = window.getSelection();

    range.setStart(node.firstChild!, 5);
    range.setEnd(node.firstChild!, 5);
    selection?.removeAllRanges();
    selection?.addRange(range);

    insertLineBreak();

    const newRange = selection?.getRangeAt(0);
    expect(newRange?.startContainer).toBe(node);
    expect(newRange?.startOffset).toBeGreaterThan(0);
  });

  it("should not throw when no selection exists", () => {
    window.getSelection()?.removeAllRanges();

    expect(() => {
      insertLineBreak();
    }).not.toThrow();
  });

  it("should not throw when selection has no ranges", () => {
    const selection = window.getSelection();
    selection?.removeAllRanges();

    expect(() => {
      insertLineBreak();
    }).not.toThrow();
  });

  it("should work with empty node", () => {
    node.textContent = "";
    const range = document.createRange();
    const selection = window.getSelection();

    range.setStart(node, 0);
    range.setEnd(node, 0);
    selection?.removeAllRanges();
    selection?.addRange(range);

    expect(() => {
      insertLineBreak();
    }).not.toThrow();
    expect(node.innerHTML).toContain("<br>");
  });
});
