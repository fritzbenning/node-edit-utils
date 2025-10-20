import { useState } from "react";

export const ResponsiveHandler = ({ children }: { children: React.ReactNode }) => {
  const [width, setWidth] = useState(400);

  const handleIncreaseWidth = () => {
    setWidth((prevWidth) => prevWidth + 100);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ width: `${width}px` }}>{children}</div>

      <button
        onClick={handleIncreaseWidth}
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Increase Width by 100px
      </button>
    </div>
  );
};
