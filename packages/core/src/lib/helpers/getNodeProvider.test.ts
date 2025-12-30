import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getNodeProvider } from "./getNodeProvider";

describe("getNodeProvider", () => {
  let nodeProvider: HTMLElement;

  beforeEach(() => {
    nodeProvider = document.createElement("div");
    nodeProvider.setAttribute("data-role", "node-provider");
  });

  afterEach(() => {
    if (document.body.contains(nodeProvider)) {
      document.body.removeChild(nodeProvider);
    }
    // Remove any other node providers
    const existingProviders = document.querySelectorAll('[data-role="node-provider"]');
    existingProviders.forEach((provider) => {
      if (document.body.contains(provider)) {
        document.body.removeChild(provider);
      }
    });
  });

  it("should return node provider element when it exists", () => {
    document.body.appendChild(nodeProvider);

    const result = getNodeProvider();

    expect(result).toBe(nodeProvider);
  });

  it("should return null when node provider does not exist", () => {
    const result = getNodeProvider();

    expect(result).toBeNull();
  });

  it("should return first node provider when multiple exist", () => {
    const firstProvider = document.createElement("div");
    firstProvider.setAttribute("data-role", "node-provider");
    const secondProvider = document.createElement("div");
    secondProvider.setAttribute("data-role", "node-provider");

    document.body.appendChild(firstProvider);
    document.body.appendChild(secondProvider);

    const result = getNodeProvider();

    expect(result).toBe(firstProvider);
  });

  it("should return null after provider is removed", () => {
    document.body.appendChild(nodeProvider);
    const result1 = getNodeProvider();
    expect(result1).toBe(nodeProvider);

    document.body.removeChild(nodeProvider);
    const result2 = getNodeProvider();
    expect(result2).toBeNull();
  });

  it("should return element with correct data-role attribute", () => {
    document.body.appendChild(nodeProvider);

    const result = getNodeProvider();

    expect(result?.getAttribute("data-role")).toBe("node-provider");
  });
});

