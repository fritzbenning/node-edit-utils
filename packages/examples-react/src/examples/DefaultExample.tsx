import { ProductCard } from "@/components/cards/ProductCard";
import { NodeEditProvider, ResponsiveHandler } from "@node-edit-utils/react";
import { MarkupCanvas } from "@markup-canvas/react";
import { EDITOR_PRESET } from "@markup-canvas/core";

function DefaultExample() {
  return (
    <MarkupCanvas {...EDITOR_PRESET} width={20000} height={15000} name="canvas">
      <ResponsiveHandler>
        <NodeEditProvider>
          <ProductCard name="React T-Shirt" price={29} rating={4} inStock={true} /> 
        </NodeEditProvider>
      </ResponsiveHandler>
    </MarkupCanvas>
  );
}

export default DefaultExample;
