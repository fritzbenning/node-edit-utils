import type { ResponsiveContainerRef } from "@node-edit-utils/core";
import { useRef } from "react";
import { useResponsiveContainer } from "@/hooks/useResponsiveContainer";

export const ResponsiveContainer = ({ children }: { children: React.ReactNode }) => {
  const responsiveContainerRef = useRef<ResponsiveContainerRef>(null);

  const responsiveContainer = useResponsiveContainer(responsiveContainerRef);

  return (
    <div ref={responsiveContainerRef} className="responsive-container">
      {children}
    </div>
  );
};
