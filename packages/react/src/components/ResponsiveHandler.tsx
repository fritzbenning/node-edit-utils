import { useState } from "react";

export const ResponsiveHandler = ({ children }: { children: React.ReactNode }) => {
  const [width, setWidth] = useState(400);

  const handleIncreaseWidth = () => {
    setWidth((prevWidth) => prevWidth + 100);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ width: `${width}px` }}>{children}</div>
    </div>
  );
};
