export const toggleClass = (element: Element | null, className: string, condition: boolean): void => {
  if (!element) return;
  if (condition) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
};

