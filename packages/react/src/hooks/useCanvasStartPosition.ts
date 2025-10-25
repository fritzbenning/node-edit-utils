import type { NodeProviderRef } from "@node-edit-utils/core";
import { useEffect, useState } from "react";

export function useCanvasStartPosition(ref: React.RefObject<NodeProviderRef>) {
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const elementDimensions = {
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      };

      setStartPosition({
        x: document.documentElement.clientWidth / 2 - elementDimensions.width / 2,
        y: document.documentElement.clientHeight / 2 - elementDimensions.height / 2,
      });
      setIsReady(true);
    }

    return () => {
      setIsReady(false);
    };
  }, [ref.current]);

  return { ...startPosition, isReady };
}
