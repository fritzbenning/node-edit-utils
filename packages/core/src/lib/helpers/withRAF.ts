export function withRAF(operation: () => void): () => void {
  const rafId = requestAnimationFrame(() => {
    operation();
  });

  return () => {
    cancelAnimationFrame(rafId);
  };
}

// biome-ignore lint/suspicious/noExplicitAny: generic constraint requires flexibility
export function withRAFThrottle<T extends (...args: any[]) => void>(func: T): T & { cleanup: () => void } {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  const throttled = (...args: Parameters<T>) => {
    lastArgs = args;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          func(...lastArgs);
        }
        rafId = null;
        lastArgs = null;
      });
    }
  };

  throttled.cleanup = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
      lastArgs = null;
    }
  };

  return throttled as T & { cleanup: () => void };
}

// biome-ignore lint/suspicious/noExplicitAny: generic constraint requires flexibility
export function withDoubleRAF<T extends (...args: any[]) => void>(func: T): T & { cleanup: () => void } {
  let rafId1: number | null = null;
  let rafId2: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  const throttled = (...args: Parameters<T>) => {
    lastArgs = args;

    if (rafId1 === null) {
      rafId1 = requestAnimationFrame(() => {
        // First RAF: let browser complete layout
        rafId2 = requestAnimationFrame(() => {
          // Second RAF: read bounds after layout is complete
          if (lastArgs) {
            const currentArgs = lastArgs;
            rafId1 = null;
            rafId2 = null;
            lastArgs = null;
            func(...currentArgs);
          }
        });
      });
    }
  };

  throttled.cleanup = () => {
    if (rafId1 !== null) {
      cancelAnimationFrame(rafId1);
      rafId1 = null;
    }
    if (rafId2 !== null) {
      cancelAnimationFrame(rafId2);
      rafId2 = null;
    }
    lastArgs = null;
  };

  return throttled as T & { cleanup: () => void };
}
