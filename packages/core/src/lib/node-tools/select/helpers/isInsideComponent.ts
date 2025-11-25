export const isInsideComponent = (element: Element): boolean => {
  let current: Element | null = element.parentElement;

  while (current) {
    if (current.getAttribute("data-instance") === "true") {
      return true;
    }

    // Stop at node-provider to avoid checking beyond the editable area
    if (current.getAttribute("data-role") === "node-provider") {
      break;
    }

    current = current.parentElement;
  }

  return false;
};
