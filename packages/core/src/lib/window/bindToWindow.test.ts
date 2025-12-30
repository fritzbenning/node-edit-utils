import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bindToWindow } from "./bindToWindow";

describe("bindToWindow", () => {
  let originalWindow: typeof window;

  beforeEach(() => {
    originalWindow = global.window;
  });

  afterEach(() => {
    // Restore original window
    global.window = originalWindow;
    // Clean up any properties we added
    if (typeof window !== "undefined") {
      delete (window as unknown as Record<string, unknown>).testKey;
      delete (window as unknown as Record<string, unknown>).nodeTools;
      delete (window as unknown as Record<string, unknown>).customProperty;
    }
  });

  it("should bind value to window object", () => {
    const testValue = { test: "value" };
    bindToWindow("testKey", testValue);

    expect((window as unknown as Record<string, unknown>).testKey).toBe(testValue);
  });

  it("should bind string value", () => {
    bindToWindow("testKey", "test string");

    expect((window as unknown as Record<string, unknown>).testKey).toBe("test string");
  });

  it("should bind number value", () => {
    bindToWindow("testKey", 42);

    expect((window as unknown as Record<string, unknown>).testKey).toBe(42);
  });

  it("should bind boolean value", () => {
    bindToWindow("testKey", true);

    expect((window as unknown as Record<string, unknown>).testKey).toBe(true);
  });

  it("should bind object value", () => {
    const obj = { prop1: "value1", prop2: 123 };
    bindToWindow("testKey", obj);

    expect((window as unknown as Record<string, unknown>).testKey).toBe(obj);
  });

  it("should bind array value", () => {
    const arr = [1, 2, 3];
    bindToWindow("testKey", arr);

    expect((window as unknown as Record<string, unknown>).testKey).toBe(arr);
  });

  it("should bind null value", () => {
    bindToWindow("testKey", null);

    expect((window as unknown as Record<string, unknown>).testKey).toBeNull();
  });

  it("should bind undefined value", () => {
    bindToWindow("testKey", undefined);

    expect((window as unknown as Record<string, unknown>).testKey).toBeUndefined();
  });

  it("should overwrite existing property", () => {
    (window as unknown as Record<string, unknown>).testKey = "old value";
    bindToWindow("testKey", "new value");

    expect((window as unknown as Record<string, unknown>).testKey).toBe("new value");
  });

  it("should bind function value", () => {
    const fn = vi.fn();
    bindToWindow("testKey", fn);

    expect((window as unknown as Record<string, unknown>).testKey).toBe(fn);
  });

  it("should work with custom property names", () => {
    const value = { custom: "data" };
    bindToWindow("customProperty", value);

    expect((window as unknown as Record<string, unknown>).customProperty).toBe(value);
  });

  it("should work with nodeTools property name", () => {
    const nodeTools = { selectNode: vi.fn() };
    bindToWindow("nodeTools", nodeTools);

    expect((window as unknown as Record<string, unknown>).nodeTools).toBe(nodeTools);
  });

  it("should handle multiple bindings", () => {
    bindToWindow("key1", "value1");
    bindToWindow("key2", "value2");
    bindToWindow("key3", "value3");

    expect((window as unknown as Record<string, unknown>).key1).toBe("value1");
    expect((window as unknown as Record<string, unknown>).key2).toBe("value2");
    expect((window as unknown as Record<string, unknown>).key3).toBe("value3");
  });

  it("should not throw when window is undefined (SSR safety)", () => {
    // Temporarily remove window
    const windowBackup = global.window;
    // @ts-ignore
    delete global.window;

    expect(() => {
      bindToWindow("testKey", "value");
    }).not.toThrow();

    // Restore window
    global.window = windowBackup;
  });

  it("should not bind when window is undefined (SSR safety)", () => {
    // Temporarily remove window
    const windowBackup = global.window;
    // @ts-ignore
    delete global.window;

    bindToWindow("testKey", "value");

    // Restore window and verify it wasn't set
    global.window = windowBackup;
    expect((window as unknown as Record<string, unknown>).testKey).toBeUndefined();
  });

  it("should handle complex nested objects", () => {
    const complexObject = {
      level1: {
        level2: {
          level3: {
            value: "deep",
          },
        },
      },
      array: [1, { nested: "object" }],
    };
    bindToWindow("testKey", complexObject);

    expect((window as unknown as Record<string, unknown>).testKey).toBe(complexObject);
  });

  it("should handle empty string key", () => {
    bindToWindow("", "empty key value");

    expect((window as unknown as Record<string, unknown>)[""]).toBe("empty key value");
  });

  it("should handle special characters in key", () => {
    bindToWindow("test-key_123", "special chars");

    expect((window as unknown as Record<string, unknown>)["test-key_123"]).toBe("special chars");
  });
});

