import type { NodeToolsRef } from "@node-edit-utils/core";
import { useEffect, useState } from "react";

export function useCanvasStartPosition(ref: React.RefObject<NodeToolsRef>) {
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const elementDimensions = {
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      };

      const x = document.documentElement.clientWidth / 2 - elementDimensions.width / 2;
      const y = document.documentElement.clientHeight / 2 - elementDimensions.height / 2;

      setStartPosition({ x, y });
      setIsReady(true);
    }

    return () => {
      setIsReady(false);
    };
  }, [ref.current]);

  return { ...startPosition, isReady };
}
