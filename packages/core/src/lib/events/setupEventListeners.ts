import { clickHandler } from './clickHandler';

export const setupEventListeners = (
  onNodeSelected: (node: HTMLElement | null) => void
): (() => void) => {
  const handleClick = (event: MouseEvent) => {
    clickHandler(event, onNodeSelected);
  };

  document.addEventListener('click', handleClick);

  return () => {
    document.removeEventListener('click', handleClick);
  };
};
