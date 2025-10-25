export const createTagLabel = (node: HTMLElement, nodeTools: HTMLElement): void => {
  const tagLabel = document.createElement("div");
  tagLabel.className = "tag-label";
  tagLabel.textContent = node.tagName.toLowerCase();

  nodeTools.appendChild(tagLabel);
};
