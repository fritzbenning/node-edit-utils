import { useEffect, RefObject, useRef, useState } from 'react';
import { NodeToolSet, NodeProviderRef } from '@node-edit-utils/core';

export const useNodeToolSet = (ref: RefObject<NodeProviderRef | null>): NodeToolSet | null => {
  const [toolSet, setToolSet] = useState<NodeToolSet | null>(null);

  useEffect(() => {
    console.log('useNodeToolSet effect running, ref.current:', ref.current);
    
    if (!ref.current) {
      console.log('ref.current is null or undefined, returning early');
      return;
    }
    
    console.log('Creating new NodeToolSet instance');
    const newToolSet = new NodeToolSet(ref.current);
    setToolSet(newToolSet);

    console.log(window.nodeEditUtils.getSelectedNode());

    return () => {
      console.log('Cleaning up NodeToolSet');
      newToolSet.cleanup();
    };
  }, [ref]);

  return toolSet;
};
