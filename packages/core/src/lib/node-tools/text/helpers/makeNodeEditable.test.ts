import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { makeNodeEditable } from "./makeNodeEditable";

describe("makeNodeEditable", () => {
  let node: HTMLElement;

  beforeEach(() => {
    node = document.createElement("div");
    document.body.appendChild(node);
  });

  afterEach(() => {
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
  });

  it("should set contentEditable to true", () => {
    makeNodeEditable(node);

    expect(node.contentEditable).toBe("true");
  });

  it("should add is-editable class", () => {
    makeNodeEditable(node);

    expect(node.classList.contains("is-editable")).toBe(true);
  });

  it("should set outline to none", () => {
    makeNodeEditable(node);

    expect(node.style.outline).toBe("none");
  });

  it("should work on node that already has contentEditable set", () => {
    node.contentEditable = "false";
    makeNodeEditable(node);

    expect(node.contentEditable).toBe("true");
  });

  it("should work on node that already has is-editable class", () => {
    node.classList.add("is-editable");
    makeNodeEditable(node);

    expect(node.classList.contains("is-editable")).toBe(true);
  });

  it("should override existing outline style", () => {
    node.style.outline = "2px solid red";
    makeNodeEditable(node);

    expect(node.style.outline).toBe("none");
  });
});
