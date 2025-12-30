import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { connectMutationObserver } from "./connectMutationObserver";

describe("connectMutationObserver", () => {
  let element: HTMLElement;
  let observer: MutationObserver;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (observer) {
      observer.disconnect();
    }
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
  });

  it("should return MutationObserver instance", () => {
    const handler = () => {};
    observer = connectMutationObserver(element, handler);

    expect(observer).toBeInstanceOf(MutationObserver);
  });

  it("should call handler on childList changes", async () => {
    const handler = vi.fn();
    observer = connectMutationObserver(element, handler);

    const child = document.createElement("div");
    element.appendChild(child);

    // Wait for observer to process
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(expect.arrayContaining([expect.any(MutationRecord)]));
  });

  it("should call handler on childList changes", async () => {
    const handler = vi.fn();
    observer = connectMutationObserver(element, handler);

    // Add a child element
    const child = document.createElement("div");
    element.appendChild(child);

    // Wait for observer to process
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(handler).toHaveBeenCalled();
  });

  it("should call handler on characterData changes", async () => {
    const handler = vi.fn();
    observer = connectMutationObserver(element, handler);

    const textNode = document.createTextNode("initial");
    element.appendChild(textNode);

    // Wait for first mutation
    await new Promise((resolve) => setTimeout(resolve, 10));
    handler.mockClear();

    textNode.textContent = "changed";

    // Wait for second mutation
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(handler).toHaveBeenCalled();
  });

  it("should observe subtree changes", async () => {
    const handler = vi.fn();
    observer = connectMutationObserver(element, handler);

    const child = document.createElement("div");
    element.appendChild(child);

    // Wait for first mutation
    await new Promise((resolve) => setTimeout(resolve, 10));
    handler.mockClear();

    // Add a grandchild to trigger subtree change
    const grandchild = document.createElement("span");
    child.appendChild(grandchild);

    // Wait for second mutation
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(handler).toHaveBeenCalled();
  });

  it("should pass mutations array to handler", async () => {
    const handler = vi.fn();
    observer = connectMutationObserver(element, handler);

    const child = document.createElement("div");
    element.appendChild(child);

    // Wait for observer to process
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(handler).toHaveBeenCalledWith(expect.any(Array));
    const mutations = handler.mock.calls[0][0];
    expect(mutations.length).toBeGreaterThan(0);
    expect(mutations[0]).toBeInstanceOf(MutationRecord);
  });

  it("should observe multiple changes", async () => {
    const handler = vi.fn();
    observer = connectMutationObserver(element, handler);

    const child1 = document.createElement("div");
    element.appendChild(child1);
    const child2 = document.createElement("div");
    element.appendChild(child2);

    // Wait for observer to process
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(handler).toHaveBeenCalled();
  });
});
