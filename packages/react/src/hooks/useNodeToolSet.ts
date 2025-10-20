import { useEffect, useRef, RefObject } from 'react';
import { NodeToolSet } from '@node-edit-utils/core';

export const useNodeToolSet = (nodeEditRef: RefObject<HTMLDivElement | null>): NodeToolSet | null => {
  const toolSetRef = useRef<NodeToolSet | null>(null);

  useEffect(() => {
    toolSetRef.current = new NodeToolSet();

    return () => {
      if (toolSetRef.current) {
        toolSetRef.current.cleanup();
        toolSetRef.current = null;
      }
    };
  }, [nodeEditRef]);

  return toolSetRef.current;
};
