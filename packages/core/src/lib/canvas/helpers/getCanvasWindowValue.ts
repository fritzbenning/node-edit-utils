export const getCanvasWindowValue = (path: string[], canvasName: string = "canvas") => {
  const canvas = (window as unknown as Record<string, unknown>)[canvasName];
  return path.reduce((obj: unknown, prop: string) => (obj as Record<string, unknown>)?.[prop], canvas);
};
