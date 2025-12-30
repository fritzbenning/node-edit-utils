import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as hasTextContentModule from "./hasTextContent";
import { shouldEnterTextEditMode } from "./shouldEnterTextEditMode";

vi.mock("./hasTextContent");

describe("shouldEnterTextEditMode", () => {
  let node: HTMLElement;

  beforeEach(() => {
    node = document.createElement("div");
    document.body.appendChild(node);
    vi.mocked(hasTextContentModule.hasTextContent).mockReturnValue(true);
  });

  afterEach(() => {
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
    vi.clearAllMocks();
  });

  it("should return false when node is null", () => {
    const result = shouldEnterTextEditMode(null);

    expect(result).toBe(false);
    expect(hasTextContentModule.hasTextContent).not.toHaveBeenCalled();
  });

  it("should return false when node is undefined", () => {
    const result = shouldEnterTextEditMode(undefined as unknown as HTMLElement);

    expect(result).toBe(false);
    expect(hasTextContentModule.hasTextContent).not.toHaveBeenCalled();
  });

  it("should return true when hasTextContent returns true", () => {
    vi.mocked(hasTextContentModule.hasTextContent).mockReturnValue(true);

    const result = shouldEnterTextEditMode(node);

    expect(result).toBe(true);
    expect(hasTextContentModule.hasTextContent).toHaveBeenCalledWith(node);
  });

  it("should return false when hasTextContent returns false", () => {
    vi.mocked(hasTextContentModule.hasTextContent).mockReturnValue(false);

    const result = shouldEnterTextEditMode(node);

    expect(result).toBe(false);
    expect(hasTextContentModule.hasTextContent).toHaveBeenCalledWith(node);
  });

  it("should call hasTextContent with the node", () => {
    shouldEnterTextEditMode(node);

    expect(hasTextContentModule.hasTextContent).toHaveBeenCalledWith(node);
  });
});

