export const getElementsFromPoint = (clickX: number, clickY: number): Element[] => {
  const elements = document.elementsFromPoint(clickX, clickY);

  return Array.from(elements).reduce(
    (acc: { elements: Element[]; found: boolean }, el) => {
      if (acc.found) return acc;
      if (el.getAttribute('data-role') === 'node-provider') {
        acc.found = true;
        return acc;
      }
      acc.elements.push(el);
      return acc;
    },
    { elements: [], found: false }
  ).elements;
};
