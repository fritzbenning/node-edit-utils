import { clickHandler } from "./clickHandler";

export const setupEventListener = (onNodeSelected: (node: HTMLElement | null) => void, nodeProvider: HTMLElement | null): (() => void) => {
  const handleClick = (event: MouseEvent) => {
    clickHandler(event, onNodeSelected, nodeProvider);
  };

  document.addEventListener("click", handleClick);

  return () => {
    document.removeEventListener("click", handleClick);
  };
};
