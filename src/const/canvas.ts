export const PIXEL_SIZE =  window.innerWidth >= 1480
    ? Math.round(window.innerWidth * 0.015)
    : Math.round(window.innerWidth * 0.029)
export const GRID_SIZE = PIXEL_SIZE;
export const CANVAS_SIZE = GRID_SIZE * PIXEL_SIZE;