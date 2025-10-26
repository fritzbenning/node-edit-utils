export const setupKeydownHandler = (node: HTMLElement): (() => void) => {
  const keydownHandler = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      // Insert a line break instead of creating a new block element
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const br = document.createElement("br");
        range.insertNode(br);

        // Move cursor after the br
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  // Add the event listener
  node.addEventListener("keydown", keydownHandler);

  // Return cleanup function
  return () => {
    node.removeEventListener("keydown", keydownHandler);
  };
};
