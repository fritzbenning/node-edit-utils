import { selectNode } from "../select/selectNode";

export const clickHandler = (event: MouseEvent, onNodeSelected: (node: HTMLElement | null) => void): void => {
  const selectedNode = selectNode(event);
  onNodeSelected(selectedNode);
};
