import { createViewport, type Viewport, type ViewportRef } from "@node-edit-utils/core";
import { type RefObject, useEffect, useState } from "react";

export const useViewport = (ref: RefObject<ViewportRef | null>): Viewport | null => {
  const [viewport, setViewport] = useState<Viewport | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const newViewport = createViewport(ref.current);
    setViewport(newViewport);

    return () => {
      newViewport?.cleanup();
    };
  }, [ref]);

  return viewport;
};
