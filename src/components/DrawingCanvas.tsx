import "./index.css"

import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import axios from "axios";

import { PREDICTION_URL } from "../const/api";
import { usePrediction } from "../contexts/PredictionContext";
import { CANVAS_SIZE, GRID_SIZE, PIXEL_SIZE } from "../const/canvas";
import { drawCrossPixel } from "../utils/drawCrossPixel";
import { markCrossPixels } from "../utils/markCrossPixels";
import { drawLine } from "../utils/drawLine";

import type { ServerResponse } from "../types/Response";
import { PuffLoader } from "react-spinners";

const DrawingCanvas: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const { prediction, probability, setPrediction, setProbability } = usePrediction()

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [pixels, setPixels] = useState<number[][]>(
        Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0))
    );
    const lastPos = useRef<{ x: number; y: number } | null>(null);  

    const updatePixels = () =>{
        setPixels((prev) => {
            if(!lastPos.current) { 
                throw new Error("Illegal State")
            }

            const updated = markCrossPixels(lastPos.current.x, lastPos.current.y, prev);
            drawCrossPixel(canvasRef, lastPos.current.x, lastPos.current.y);
            return updated;
        });
    }

    const handleMouse = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);

        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;

        if (lastPos.current) {
            drawLine(updatePixels, lastPos.current.x, lastPos.current.y, x, y);
        } else {
            setPixels((prev) => {
                const updated = markCrossPixels(x, y, prev);
                drawCrossPixel(canvasRef, x, y);
                return updated;
            });
        }
        lastPos.current = { x, y };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDrawing(true);
        handleMouse(e);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        lastPos.current = null;
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current!.getContext("2d")!;
        ctx.fillStyle = "#12000f";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        setPixels(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)));
        lastPos.current = null;
        setPrediction(0);
        setProbability(0)
    };

    const handleSend = async () => {
        setLoading(true)
        const payload = { pixels: pixels.map(row => row.map(p => Math.round(p * 255))) };
        const res = await axios.post<ServerResponse>(PREDICTION_URL, payload);
        
        setPrediction(res.data.data.digit);
        setProbability(res.data.data.probability)
        setLoading(false)
    };

    useEffect(() => {
        clearCanvas();
    }, []);

    const getTouchPos = (e: React.TouchEvent) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = Math.floor((touch.clientX - rect.left) / PIXEL_SIZE);
        const y = Math.floor((touch.clientY - rect.top) / PIXEL_SIZE);
        return { x, y };
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        setIsDrawing(true);
        const { x, y } = getTouchPos(e);
        lastPos.current = { x, y };
    
        setPixels((prev) => {
            const updated = markCrossPixels(x, y, prev);
            drawCrossPixel(canvasRef, x, y);
            return updated;
        });
    };
    
    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        if (!isDrawing) return;
        const { x, y } = getTouchPos(e);
    
        if (lastPos.current) {
            drawLine(updatePixels, lastPos.current.x, lastPos.current.y, x, y);
        } else {
            setPixels((prev) => {
                const updated = markCrossPixels(x, y, prev);
                drawCrossPixel(canvasRef, x, y);
                return updated;
            });
        }
    
        lastPos.current = { x, y };
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault();
        setIsDrawing(false);
        lastPos.current = null;
    };
    
    

    return (
        <section>
            <div className="canvas-container">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    className="drawing-canvas border border-white"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouse}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    style={{ background: "black", cursor: "crosshair" }}
                />
                <div className="btns">
                    <motion.button
                        onClick={handleSend}
                        className="shiny-btn btn"
                        whileHover="hover"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
                        variants={{
                            hover: {
                                scale: 1.05,
                                transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                },
                            },
                        }}
                    >
                        Wyślij
                    </motion.button>
                    <motion.div
                        className="info"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                    >
                        {loading 
                            ? <div className="loading-container">
                                <PuffLoader className="loading-ico" color="#fcd6f9" speedMultiplier={1.3}/>
                            </div>
                            : <>
                                <div className="special-text digit">{prediction}</div>
                                <div className="main-text probability">{probability}%</div>
                            </>}
                    </motion.div>
                    <motion.button
                        onClick={clearCanvas}
                        className="shiny-btn btn"
                        whileHover="hover"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
                        variants={{
                            hover: {
                                scale: 1.05,
                                transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                },
                            },
                        }}
                    >
                        Wyczyść
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default DrawingCanvas;