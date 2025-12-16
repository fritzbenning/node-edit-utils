import { CanvasProvider, Viewport } from "@node-edit-utils/react";
import { ProductCard } from "@/components/cards/ProductCard";
import "@node-edit-utils/core/styles.css";

function DefaultExample() {
  return (
    <CanvasProvider width={20000} height={15000} themeMode="light" canvasName="canvas-1" viewportWidth={1000}>
      <Viewport width={480} name="ProductCard" exported>
        <ProductCard name="React T-Shirt" price={29} rating={4} inStock={true} />
      </Viewport>
      <Viewport width={300} x={1200} y={0} name="TestContent">
        Viewport 2
      </Viewport>
    </CanvasProvider>
  );
}

export default DefaultExample;
