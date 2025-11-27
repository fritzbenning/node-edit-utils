import { createCanvasObserver } from "@node-edit-utils/core";
import { useEffect } from "react";

export function useCanvasObserver(canvasName: string = "canvas"): void {
  useEffect(() => {
    const observer = createCanvasObserver(canvasName);

    return () => {
      observer.disconnect();
    };
  }, [canvasName]);
}
