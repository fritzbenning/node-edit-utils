import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withDoubleRAF, withRAF, withRAFThrottle } from "./withRAF";

describe("withRAF", () => {
  let rafCallbacks: Map<number, FrameRequestCallback>;
  let rafIdCounter: number;
  let originalRAF: typeof requestAnimationFrame;
  let originalCancelRAF: typeof cancelAnimationFrame;

  beforeEach(() => {
    rafCallbacks = new Map();
    rafIdCounter = 0;
    originalRAF = global.requestAnimationFrame;
    originalCancelRAF = global.cancelAnimationFrame;

    global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      const id = ++rafIdCounter;
      rafCallbacks.set(id, callback);
      return id;
    }) as unknown as typeof requestAnimationFrame;

    global.cancelAnimationFrame = vi.fn((id: number) => {
      rafCallbacks.delete(id);
    }) as unknown as typeof cancelAnimationFrame;
  });

  afterEach(() => {
    global.requestAnimationFrame = originalRAF;
    global.cancelAnimationFrame = originalCancelRAF;
    rafCallbacks.clear();
  });

  it("should execute operation on next animation frame", () => {
    const operation = vi.fn();
    const cleanup = withRAF(operation);

    expect(operation).not.toHaveBeenCalled();

    // Execute the RAF callback
    rafCallbacks.forEach((callback) => {
      callback(performance.now());
    });

    expect(operation).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it("should return cleanup function", () => {
    const operation = vi.fn();
    const cleanup = withRAF(operation);

    expect(typeof cleanup).toBe("function");
    cleanup();
  });

  it("should cancel operation when cleanup is called", () => {
    const operation = vi.fn();
    const cleanup = withRAF(operation);

    cleanup();

    // Execute any remaining RAF callbacks
    rafCallbacks.forEach((callback) => {
      callback(performance.now());
    });

    expect(operation).not.toHaveBeenCalled();
  });

  it("should execute operation only once", () => {
    const operation = vi.fn();
    const cleanup = withRAF(operation);

    // Execute RAF callback once
    const rafId = Array.from(rafCallbacks.keys())[0];
    const callback = rafCallbacks.get(rafId);
    if (callback) {
      callback(performance.now());
      rafCallbacks.delete(rafId); // Remove after execution
    }

    // Try to execute again (should be empty now)
    rafCallbacks.forEach((cb) => {
      cb(performance.now());
    });

    expect(operation).toHaveBeenCalledTimes(1);

    cleanup();
  });
});

describe("withRAFThrottle", () => {
  let rafCallbacks: Map<number, FrameRequestCallback>;
  let rafIdCounter: number;
  let originalRAF: typeof requestAnimationFrame;
  let originalCancelRAF: typeof cancelAnimationFrame;

  beforeEach(() => {
    rafCallbacks = new Map();
    rafIdCounter = 0;
    originalRAF = global.requestAnimationFrame;
    originalCancelRAF = global.cancelAnimationFrame;

    global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      const id = ++rafIdCounter;
      rafCallbacks.set(id, callback);
      return id;
    }) as unknown as typeof requestAnimationFrame;

    global.cancelAnimationFrame = vi.fn((id: number) => {
      rafCallbacks.delete(id);
    }) as unknown as typeof cancelAnimationFrame;
  });

  afterEach(() => {
    global.requestAnimationFrame = originalRAF;
    global.cancelAnimationFrame = originalCancelRAF;
    rafCallbacks.clear();
  });

  it("should throttle function calls", () => {
    const func = vi.fn();
    const throttled = withRAFThrottle(func);

    throttled("arg1");
    throttled("arg2");
    throttled("arg3");

    expect(func).not.toHaveBeenCalled();

    // Execute RAF callback
    rafCallbacks.forEach((callback) => {
      callback(performance.now());
    });

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("arg3"); // Should use last args
  });

  it("should return throttled function with cleanup", () => {
    const func = vi.fn();
    const throttled = withRAFThrottle(func);

    expect(typeof throttled).toBe("function");
    expect(typeof throttled.cleanup).toBe("function");
  });

  it("should cancel pending call on cleanup", () => {
    const func = vi.fn();
    const throttled = withRAFThrottle(func);

    throttled("arg1");
    throttled.cleanup();

    // Try to execute any remaining RAF callbacks
    rafCallbacks.forEach((callback) => {
      callback(performance.now());
    });

    expect(func).not.toHaveBeenCalled();
  });

  it("should handle multiple rapid calls", () => {
    const func = vi.fn();
    const throttled = withRAFThrottle(func);

    throttled("call1");
    throttled("call2");
    throttled("call3");
    throttled("call4");
    throttled("call5");

    // Execute RAF callback
    rafCallbacks.forEach((callback) => {
      callback(performance.now());
    });

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("call5");
  });

  it("should allow new calls after previous one executes", () => {
    const func = vi.fn();
    const throttled = withRAFThrottle(func);

    throttled("first");
    rafCallbacks.forEach((callback) => {
      callback(performance.now());
    });

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("first");

    throttled("second");
    rafCallbacks.forEach((callback) => {
      callback(performance.now());
    });

    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenCalledWith("second");
  });

  it("should handle function with multiple arguments", () => {
    const func = vi.fn();
    const throttled = withRAFThrottle(func);

    throttled("arg1", "arg2", "arg3");
    rafCallbacks.forEach((callback) => {
      callback(performance.now());
    });

    expect(func).toHaveBeenCalledWith("arg1", "arg2", "arg3");
  });

  it("should reset state on cleanup", () => {
    const func = vi.fn();
    const throttled = withRAFThrottle(func);

    throttled("arg1");
    throttled.cleanup();

    // After cleanup, should be able to call again
    throttled("arg2");
    rafCallbacks.forEach((callback) => {
      callback(performance.now());
    });

    expect(func).toHaveBeenCalledWith("arg2");
  });
});

describe("withDoubleRAF", () => {
  let rafCallbacks: Map<number, FrameRequestCallback>;
  let rafIdCounter: number;
  let originalRAF: typeof requestAnimationFrame;
  let originalCancelRAF: typeof cancelAnimationFrame;

  beforeEach(() => {
    rafCallbacks = new Map();
    rafIdCounter = 0;
    originalRAF = global.requestAnimationFrame;
    originalCancelRAF = global.cancelAnimationFrame;

    global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      const id = ++rafIdCounter;
      rafCallbacks.set(id, callback);
      return id;
    }) as unknown as typeof requestAnimationFrame;

    global.cancelAnimationFrame = vi.fn((id: number) => {
      rafCallbacks.delete(id);
    }) as unknown as typeof cancelAnimationFrame;
  });

  afterEach(() => {
    global.requestAnimationFrame = originalRAF;
    global.cancelAnimationFrame = originalCancelRAF;
    rafCallbacks.clear();
  });

  it("should execute function after two animation frames", () => {
    const func = vi.fn();
    const throttled = withDoubleRAF(func);

    throttled("arg1");

    expect(func).not.toHaveBeenCalled();

    // Execute first RAF (which schedules second RAF)
    const firstRAFId = Array.from(rafCallbacks.keys())[0];
    const firstCallback = rafCallbacks.get(firstRAFId);
    if (firstCallback) {
      firstCallback(performance.now());
      rafCallbacks.delete(firstRAFId);
    }
    expect(func).not.toHaveBeenCalled();

    // Execute second RAF
    const secondRAFId = Array.from(rafCallbacks.keys())[0];
    const secondCallback = rafCallbacks.get(secondRAFId);
    if (secondCallback) {
      secondCallback(performance.now());
    }
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("arg1");
  });

  it("should return throttled function with cleanup", () => {
    const func = vi.fn();
    const throttled = withDoubleRAF(func);

    expect(typeof throttled).toBe("function");
    expect(typeof throttled.cleanup).toBe("function");
  });

  it("should cancel pending calls on cleanup", () => {
    const func = vi.fn();
    const throttled = withDoubleRAF(func);

    throttled("arg1");
    throttled.cleanup();

    // Try to execute any remaining RAF callbacks
    rafCallbacks.forEach((callback) => {
      callback(performance.now());
    });

    expect(func).not.toHaveBeenCalled();
  });

  it("should throttle multiple rapid calls", () => {
    const func = vi.fn();
    const throttled = withDoubleRAF(func);

    throttled("call1");
    throttled("call2");
    throttled("call3");

    // Execute first RAF
    const firstRAFId = Array.from(rafCallbacks.keys())[0];
    const firstCallback = rafCallbacks.get(firstRAFId);
    if (firstCallback) {
      firstCallback(performance.now());
      rafCallbacks.delete(firstRAFId);
    }

    // Execute second RAF
    const secondRAFId = Array.from(rafCallbacks.keys())[0];
    const secondCallback = rafCallbacks.get(secondRAFId);
    if (secondCallback) {
      secondCallback(performance.now());
    }

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("call3");
  });

  it("should allow new calls after previous one executes", () => {
    const func = vi.fn();
    const throttled = withDoubleRAF(func);

    throttled("first");
    // Execute double RAF
    const firstRAFId = Array.from(rafCallbacks.keys())[0];
    const firstCallback = rafCallbacks.get(firstRAFId);
    if (firstCallback) {
      firstCallback(performance.now());
      rafCallbacks.delete(firstRAFId);
      const secondRAFId = Array.from(rafCallbacks.keys())[0];
      const secondCallback = rafCallbacks.get(secondRAFId);
      if (secondCallback) {
        secondCallback(performance.now());
      }
    }

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("first");

    throttled("second");
    // Execute double RAF again
    const firstRAFId2 = Array.from(rafCallbacks.keys())[0];
    const firstCallback2 = rafCallbacks.get(firstRAFId2);
    if (firstCallback2) {
      firstCallback2(performance.now());
      rafCallbacks.delete(firstRAFId2);
      const secondRAFId2 = Array.from(rafCallbacks.keys())[0];
      const secondCallback2 = rafCallbacks.get(secondRAFId2);
      if (secondCallback2) {
        secondCallback2(performance.now());
      }
    }

    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenCalledWith("second");
  });

  it("should handle function with multiple arguments", () => {
    const func = vi.fn();
    const throttled = withDoubleRAF(func);

    throttled("arg1", "arg2", "arg3");
    // Execute double RAF
    const firstRAFId = Array.from(rafCallbacks.keys())[0];
    const firstCallback = rafCallbacks.get(firstRAFId);
    if (firstCallback) {
      firstCallback(performance.now());
      rafCallbacks.delete(firstRAFId);
      const secondRAFId = Array.from(rafCallbacks.keys())[0];
      const secondCallback = rafCallbacks.get(secondRAFId);
      if (secondCallback) {
        secondCallback(performance.now());
      }
    }

    expect(func).toHaveBeenCalledWith("arg1", "arg2", "arg3");
  });

  it("should cancel first RAF if cleanup called before second RAF", () => {
    const func = vi.fn();
    const throttled = withDoubleRAF(func);

    throttled("arg1");

    throttled.cleanup();

    // Try to execute any remaining RAF callbacks
    rafCallbacks.forEach((callback) => {
      callback(performance.now());
    });

    expect(func).not.toHaveBeenCalled();
  });

  it("should cancel second RAF if cleanup called after first RAF", () => {
    const func = vi.fn();
    const throttled = withDoubleRAF(func);

    throttled("arg1");

    // Execute first RAF
    const firstRAFId = Array.from(rafCallbacks.keys())[0];
    const firstCallback = rafCallbacks.get(firstRAFId);
    if (firstCallback) {
      firstCallback(performance.now());
      rafCallbacks.delete(firstRAFId);
    }

    throttled.cleanup();

    // Try to execute any remaining RAF callbacks
    rafCallbacks.forEach((callback) => {
      callback(performance.now());
    });

    expect(func).not.toHaveBeenCalled();
  });
});
