import { GRID_SIZE } from "../const/canvas";

export const markCrossPixels = (x: number, y: number, prevPixels: number[][]) => {
        const updated = prevPixels.map(row => [...row]);
    
        if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
            updated[y][x] = 1;
        }
    
        const neighbors = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
        ];
        neighbors.forEach(([nx, ny]) => {
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                if (updated[ny][nx] < 0.5) {
                    updated[ny][nx] = 0.5;
                }
            }
        });
    
        return updated;
    };