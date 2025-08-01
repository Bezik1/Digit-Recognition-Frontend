export const GRID_SIZE = 28;

const baseSize = Math.min(window.innerWidth * 0.55, window.innerHeight * 0.7);
export const PIXEL_SIZE = Math.floor(baseSize / GRID_SIZE);
export const CANVAS_SIZE = GRID_SIZE * PIXEL_SIZE;
