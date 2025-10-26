import { createCanvasObserver } from "@node-edit-utils/core";
import { useEffect } from "react";

export function useCanvasObserver(): void {
  useEffect(() => {
    const observer = createCanvasObserver();

    return () => {
      observer.disconnect();
    };
  }, []);
}
