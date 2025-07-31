import { GRID_SIZE, PIXEL_SIZE } from "../const/canvas";

export const drawCrossPixel = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    x: number,
    y: number
) => {
        const ctx = canvasRef.current!.getContext("2d")!;
    
        if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
            ctx.fillStyle = "#fcd6f9ffaa";
            ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
    
        const neighbors = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
        ];
    
        ctx.fillStyle = "#fcd6f933";
        neighbors.forEach(([nx, ny]) => {
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                ctx.fillRect(nx * PIXEL_SIZE, ny * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        });
};