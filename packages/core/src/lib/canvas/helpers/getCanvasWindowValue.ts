export const getCanvasWindowValue = (path: string[], canvasName: string = "canvas") => {
  // biome-ignore lint/suspicious/noExplicitAny: global window extension
  const canvas = (window as any)[canvasName];
  return path.reduce((obj, prop) => obj?.[prop], canvas);
};
