import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { makeNodeNonEditable } from "./makeNodeNonEditable";

describe("makeNodeNonEditable", () => {
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

  it("should set contentEditable to false", () => {
    node.contentEditable = "true";
    makeNodeNonEditable(node);

    expect(node.contentEditable).toBe("false");
  });

  it("should remove is-editable class", () => {
    node.classList.add("is-editable");
    makeNodeNonEditable(node);

    expect(node.classList.contains("is-editable")).toBe(false);
  });

  it("should set outline to none", () => {
    makeNodeNonEditable(node);

    expect(node.style.outline).toBe("none");
  });

  it("should work on node that is not editable", () => {
    node.contentEditable = "false";
    makeNodeNonEditable(node);

    expect(node.contentEditable).toBe("false");
  });

  it("should work on node that does not have is-editable class", () => {
    makeNodeNonEditable(node);

    expect(node.classList.contains("is-editable")).toBe(false);
  });

  it("should override existing outline style", () => {
    node.style.outline = "2px solid red";
    makeNodeNonEditable(node);

    expect(node.style.outline).toBe("none");
  });
});
