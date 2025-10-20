import { ProductCard } from "@/components/cards/ProductCard";
import { NodeEditProvider } from "@node-edit-utils/react";

function DefaultExample() {
  return (
    <NodeEditProvider>
    <ProductCard
      name="React T-Shirt"
      price={29}
      rating={4}
      inStock={true}
    />
    </NodeEditProvider>
  );
}

export default DefaultExample;
