export const isComponentInstance = (element: Element): boolean => {
  return element.getAttribute("data-instance") === "true";
};
