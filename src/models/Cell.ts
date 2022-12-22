export type Cell = {
  id: string,
  x: number,
  y: number,
  isHole: boolean,
  status: 'hidden' | 'revealed',
  nearbyHoles: null | number
};
