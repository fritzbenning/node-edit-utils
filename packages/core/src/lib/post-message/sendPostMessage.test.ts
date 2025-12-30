import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendPostMessage } from "./sendPostMessage";

describe("sendPostMessage", () => {
  let originalPostMessage: typeof window.parent.postMessage;
  let mockPostMessage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPostMessage = vi.fn();
    originalPostMessage = window.parent.postMessage;
    window.parent.postMessage = mockPostMessage;
    vi.useFakeTimers();
  });

  afterEach(() => {
    window.parent.postMessage = originalPostMessage;
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should send postMessage with correct format", () => {
    const mockDate = new Date("2024-01-01T00:00:00Z");
    vi.setSystemTime(mockDate);

    sendPostMessage("testAction", "testData");

    expect(mockPostMessage).toHaveBeenCalledTimes(1);
    expect(mockPostMessage).toHaveBeenCalledWith(
      {
        source: "node-edit-utils",
        action: "testAction",
        data: "testData",
        timestamp: mockDate.getTime(),
      },
      "*"
    );
  });

  it("should include timestamp in message", () => {
    const mockDate = new Date("2024-01-01T12:00:00Z");
    vi.setSystemTime(mockDate);

    sendPostMessage("testAction", { test: "data" });

    expect(mockPostMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        timestamp: mockDate.getTime(),
      }),
      "*"
    );
  });

  it("should send different action types", () => {
    sendPostMessage("selectedNodeChanged", "node-123");
    sendPostMessage("textContentChanged", { nodeId: "node-123", textContent: "Hello" });

    expect(mockPostMessage).toHaveBeenCalledTimes(2);
    expect(mockPostMessage).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: "selectedNodeChanged",
        data: "node-123",
      }),
      "*"
    );
    expect(mockPostMessage).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        action: "textContentChanged",
        data: { nodeId: "node-123", textContent: "Hello" },
      }),
      "*"
    );
  });

  it("should send different data types", () => {
    sendPostMessage("action1", "string");
    sendPostMessage("action2", 123);
    sendPostMessage("action3", { key: "value" });
    sendPostMessage("action4", null);
    sendPostMessage("action5", undefined);

    expect(mockPostMessage).toHaveBeenCalledTimes(5);
    expect(mockPostMessage).toHaveBeenNthCalledWith(1, expect.objectContaining({ data: "string" }), "*");
    expect(mockPostMessage).toHaveBeenNthCalledWith(2, expect.objectContaining({ data: 123 }), "*");
    expect(mockPostMessage).toHaveBeenNthCalledWith(3, expect.objectContaining({ data: { key: "value" } }), "*");
    expect(mockPostMessage).toHaveBeenNthCalledWith(4, expect.objectContaining({ data: null }), "*");
    expect(mockPostMessage).toHaveBeenNthCalledWith(5, expect.objectContaining({ data: undefined }), "*");
  });

  it("should always use source 'node-edit-utils'", () => {
    sendPostMessage("anyAction", "anyData");

    expect(mockPostMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "node-edit-utils",
      }),
      "*"
    );
  });

  it("should always use '*' as targetOrigin", () => {
    sendPostMessage("anyAction", "anyData");

    expect(mockPostMessage).toHaveBeenCalledWith(expect.any(Object), "*");
  });

  it("should include all required fields", () => {
    const mockDate = new Date("2024-01-01T00:00:00Z");
    vi.setSystemTime(mockDate);

    sendPostMessage("testAction", "testData");

    const callArgs = mockPostMessage.mock.calls[0][0];
    expect(callArgs).toHaveProperty("source");
    expect(callArgs).toHaveProperty("action");
    expect(callArgs).toHaveProperty("data");
    expect(callArgs).toHaveProperty("timestamp");
  });
});
