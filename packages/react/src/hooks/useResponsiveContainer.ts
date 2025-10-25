import { ResponsiveContainer, type ResponsiveContainerRef } from "@node-edit-utils/core";
import { type RefObject, useEffect, useState } from "react";

export const useResponsiveContainer = (ref: RefObject<ResponsiveContainerRef | null>): ResponsiveContainer | null => {
  const [responsiveContainer, setResponsiveContainer] = useState<ResponsiveContainer | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const newResponsiveContainer = new ResponsiveContainer(ref.current);
    setResponsiveContainer(newResponsiveContainer);

    return () => {
      newResponsiveContainer?.cleanup();
    };
  }, [ref]);

  return responsiveContainer;
};
