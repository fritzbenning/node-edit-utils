const TAG_NAME_MAP: Record<string, string> = {
  div: "Container",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  p: "Text",
  li: "List Item",
  ul: "Unordered List",
  ol: "Ordered List",
  img: "Image",
  a: "Link",
};

const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const createTagLabel = (node: HTMLElement, nodeTools: HTMLElement): void => {
  const tagLabel = document.createElement("div");
  tagLabel.className = "tag-label";
  const instanceName = node.getAttribute("data-instance-name");
  const tagName = node.tagName.toLowerCase();
  const labelText = instanceName || TAG_NAME_MAP[tagName] || tagName;
  tagLabel.textContent = capitalize(labelText);

  nodeTools.appendChild(tagLabel);
};
