import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isInsideComponent } from "./isInsideComponent";

describe("isInsideComponent", () => {
  let nodeProvider: HTMLElement;
  let component: HTMLElement;
  let element: HTMLElement;

  beforeEach(() => {
    nodeProvider = document.createElement("div");
    nodeProvider.setAttribute("data-role", "node-provider");
    document.body.appendChild(nodeProvider);

    component = document.createElement("div");
    component.setAttribute("data-instance", "true");
    nodeProvider.appendChild(component);

    element = document.createElement("div");
    component.appendChild(element);
  });

  afterEach(() => {
    if (document.body.contains(nodeProvider)) {
      document.body.removeChild(nodeProvider);
    }
  });

  it("should return true when element is inside component", () => {
    const result = isInsideComponent(element);

    expect(result).toBe(true);
  });

  it("should return true when element is nested inside component", () => {
    const nested = document.createElement("div");
    element.appendChild(nested);

    const result = isInsideComponent(nested);

    expect(result).toBe(true);
  });

  it("should return false when element is not inside component", () => {
    const outsideElement = document.createElement("div");
    nodeProvider.appendChild(outsideElement);

    const result = isInsideComponent(outsideElement);

    expect(result).toBe(false);
  });

  it("should stop at node-provider", () => {
    const elementOutsideComponent = document.createElement("div");
    nodeProvider.appendChild(elementOutsideComponent);

    const result = isInsideComponent(elementOutsideComponent);

    expect(result).toBe(false);
  });

  it("should return false when element is direct child of node-provider", () => {
    const directChild = document.createElement("div");
    nodeProvider.appendChild(directChild);

    const result = isInsideComponent(directChild);

    expect(result).toBe(false);
  });

  it("should handle component without data-instance attribute", () => {
    const nonComponent = document.createElement("div");
    nodeProvider.appendChild(nonComponent);
    const child = document.createElement("div");
    nonComponent.appendChild(child);

    const result = isInsideComponent(child);

    expect(result).toBe(false);
  });
});

