import { useEffect, useState } from "react";

export function useCanvasPanPosition() {
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const nodeProvider = document.querySelector('[data-role="node-provider"]');
    if (nodeProvider) {
      const exportedViewport = nodeProvider.querySelector('[data-exported="true"]') as HTMLElement;

      if (exportedViewport) {
        const rect = exportedViewport.getBoundingClientRect();

        const x = document.documentElement.clientWidth / 2 - rect.width / 2 - rect.left;
        const y = document.documentElement.clientHeight / 2 - rect.height / 2 - rect.top;

        setStartPosition({ x, y });
        setIsReady(true);
      }
    }

    return () => {
      setIsReady(false);
    };
  }, []);

  return { ...startPosition, isReady };
}
