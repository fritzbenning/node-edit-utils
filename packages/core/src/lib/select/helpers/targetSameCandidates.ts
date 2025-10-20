export const targetSameCandidates = (cache: Element[], current: Element[]): boolean =>
  cache.length === current.length && cache.every((el, i) => el === current[i]);
