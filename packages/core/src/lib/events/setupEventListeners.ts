import { clickHandler } from './clickHandler';

export const setupEventListeners = (): (() => void) => {
  const handleClick = (event: MouseEvent) => {
    clickHandler(event);
  };

  document.addEventListener('click', handleClick);

  return () => {
    document.removeEventListener('click', handleClick);
  };
};
