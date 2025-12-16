export const isInsideViewport = (element: Element): boolean => {
  let current: Element | null = element;

  while (current) {
    if (current.classList.contains("viewport")) {
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

