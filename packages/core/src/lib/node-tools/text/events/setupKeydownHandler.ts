import { insertLineBreak } from "../helpers/insertLineBreak";

export const setupKeydownHandler = (node: HTMLElement): (() => void) => {
  const keydownHandler = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      insertLineBreak();
    }
  };

  node.addEventListener("keydown", keydownHandler);

  return () => {
    node.removeEventListener("keydown", keydownHandler);
  };
};
