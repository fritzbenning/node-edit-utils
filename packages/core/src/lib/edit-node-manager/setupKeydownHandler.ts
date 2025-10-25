export const setupKeydownHandler = (node: HTMLElement, blur: () => void): (() => void) => {
  const keydownHandler = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();

      blur();
    }
  };

  // Add the event listener
  node.addEventListener("keydown", keydownHandler);

  // Return cleanup function
  return () => {
    node.removeEventListener("keydown", keydownHandler);
  };
};
