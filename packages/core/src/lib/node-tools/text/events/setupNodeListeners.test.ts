import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as setupKeydownHandlerModule from "./setupKeydownHandler";
import * as setupMutationObserverModule from "./setupMutationObserver";
import { setupNodeListeners } from "./setupNodeListeners";

vi.mock("./setupKeydownHandler");
vi.mock("./setupMutationObserver");

describe("setupNodeListeners", () => {
  let node: HTMLElement;
  let nodeProvider: HTMLElement;
  let blurHandler: ReturnType<typeof vi.fn>;
  let keydownCleanup: ReturnType<typeof vi.fn>;
  let mutationCleanup: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    node = document.createElement("div");
    node.contentEditable = "true";
    document.body.appendChild(node);

    nodeProvider = document.createElement("div");
    document.body.appendChild(nodeProvider);

    blurHandler = vi.fn();
    keydownCleanup = vi.fn();
    mutationCleanup = vi.fn();

    vi.mocked(setupKeydownHandlerModule.setupKeydownHandler).mockReturnValue(keydownCleanup);
    vi.mocked(setupMutationObserverModule.setupMutationObserver).mockReturnValue(mutationCleanup);
  });

  afterEach(() => {
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
    if (document.body.contains(nodeProvider)) {
      document.body.removeChild(nodeProvider);
    }
    vi.clearAllMocks();
  });

  it("should return cleanup function", () => {
    const cleanup = setupNodeListeners(node, nodeProvider, blurHandler);

    expect(typeof cleanup).toBe("function");
  });

  it("should return no-op cleanup when nodeProvider is null", () => {
    const cleanup = setupNodeListeners(node, null, blurHandler);

    expect(typeof cleanup).toBe("function");
    expect(setupKeydownHandlerModule.setupKeydownHandler).not.toHaveBeenCalled();
    expect(setupMutationObserverModule.setupMutationObserver).not.toHaveBeenCalled();
  });

  it("should setup blur listener", () => {
    setupNodeListeners(node, nodeProvider, blurHandler);

    const blurEvent = new FocusEvent("blur");
    node.dispatchEvent(blurEvent);

    expect(blurHandler).toHaveBeenCalled();
  });

  it("should setup keydown handler", () => {
    setupNodeListeners(node, nodeProvider, blurHandler);

    expect(setupKeydownHandlerModule.setupKeydownHandler).toHaveBeenCalledWith(node);
  });

  it("should setup mutation observer", () => {
    setupNodeListeners(node, nodeProvider, blurHandler);

    expect(setupMutationObserverModule.setupMutationObserver).toHaveBeenCalledWith(node, nodeProvider, "canvas");
  });

  it("should use custom canvas name", () => {
    setupNodeListeners(node, nodeProvider, blurHandler, "custom-canvas");

    expect(setupMutationObserverModule.setupMutationObserver).toHaveBeenCalledWith(node, nodeProvider, "custom-canvas");
  });

  it("should remove blur listener on cleanup", () => {
    const cleanup = setupNodeListeners(node, nodeProvider, blurHandler);

    cleanup();

    const blurEvent = new FocusEvent("blur");
    node.dispatchEvent(blurEvent);

    expect(blurHandler).not.toHaveBeenCalled();
  });

  it("should call keydown cleanup on cleanup", () => {
    const cleanup = setupNodeListeners(node, nodeProvider, blurHandler);

    cleanup();

    expect(keydownCleanup).toHaveBeenCalled();
  });

  it("should call mutation cleanup on cleanup", () => {
    const cleanup = setupNodeListeners(node, nodeProvider, blurHandler);

    cleanup();

    expect(mutationCleanup).toHaveBeenCalled();
  });

  it("should handle cleanup when mutation cleanup is undefined", () => {
    vi.mocked(setupMutationObserverModule.setupMutationObserver).mockReturnValue(undefined);

    const cleanup = setupNodeListeners(node, nodeProvider, blurHandler);

    expect(() => {
      cleanup();
    }).not.toThrow();
  });

  it("should cleanup all listeners", () => {
    const cleanup = setupNodeListeners(node, nodeProvider, blurHandler);

    cleanup();

    expect(keydownCleanup).toHaveBeenCalled();
    expect(mutationCleanup).toHaveBeenCalled();
    
    const blurEvent = new FocusEvent("blur");
    node.dispatchEvent(blurEvent);
    expect(blurHandler).not.toHaveBeenCalled();
  });
});

