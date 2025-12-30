import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { toggleClass } from "./toggleClass";

describe("toggleClass", () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
  });

  it("should add class when condition is true", () => {
    toggleClass(element, "test-class", true);

    expect(element.classList.contains("test-class")).toBe(true);
  });

  it("should remove class when condition is false", () => {
    element.classList.add("test-class");
    toggleClass(element, "test-class", false);

    expect(element.classList.contains("test-class")).toBe(false);
  });

  it("should not add class when condition is false", () => {
    toggleClass(element, "test-class", false);

    expect(element.classList.contains("test-class")).toBe(false);
  });

  it("should not remove class when condition is true and class already exists", () => {
    element.classList.add("test-class");
    toggleClass(element, "test-class", true);

    expect(element.classList.contains("test-class")).toBe(true);
  });

  it("should handle multiple classes", () => {
    toggleClass(element, "class1", true);
    toggleClass(element, "class2", true);
    toggleClass(element, "class3", false);

    expect(element.classList.contains("class1")).toBe(true);
    expect(element.classList.contains("class2")).toBe(true);
    expect(element.classList.contains("class3")).toBe(false);
  });

  it("should do nothing when element is null", () => {
    expect(() => {
      toggleClass(null, "test-class", true);
    }).not.toThrow();
  });

  it("should toggle class multiple times", () => {
    toggleClass(element, "test-class", true);
    expect(element.classList.contains("test-class")).toBe(true);

    toggleClass(element, "test-class", false);
    expect(element.classList.contains("test-class")).toBe(false);

    toggleClass(element, "test-class", true);
    expect(element.classList.contains("test-class")).toBe(true);
  });
});

