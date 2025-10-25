import { CanvasProvider } from "@node-edit-utils/react";
import { ProductCard } from "@/components/cards/ProductCard";
import "@node-edit-utils/core/styles.css";

function DefaultExample() {
  return (
    <CanvasProvider width={20000} height={15000}>
      <ProductCard name="React T-Shirt" price={29} rating={4} inStock={true} />
    </CanvasProvider>
  );
}

export default DefaultExample;
