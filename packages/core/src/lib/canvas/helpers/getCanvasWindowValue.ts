export const getCanvasWindowValue = (path: string[]) => {
  // biome-ignore lint/suspicious/noExplicitAny: global window extension
  const canvas = (window as any).canvas;
  return path.reduce((obj, prop) => obj?.[prop], canvas);
};
