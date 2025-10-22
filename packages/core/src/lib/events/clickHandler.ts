import { clearHighlightFrame } from "@/umd";
import { selectNode } from "../select/selectNode";

export const clickHandler = (event: MouseEvent, onNodeSelected: (node: HTMLElement | null) => void, nodeProvider: HTMLElement | null): void => {
  event.preventDefault();
  event.stopPropagation();
  
  if (nodeProvider && !nodeProvider.contains(event.target as Node)) {
    clearHighlightFrame(nodeProvider);
    return;
  }
  
  console.log("clickHandler", event);
   
  

  const selectedNode = selectNode(event);
  onNodeSelected(selectedNode);
};
