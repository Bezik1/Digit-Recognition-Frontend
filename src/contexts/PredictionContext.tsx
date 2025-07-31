import { createContext, useContext, useState } from "react";
import type { PredictionContextType } from "../types/PredictionContextType";
import type { ParentProps } from "../types/ParentProps";

const PredictionContext = createContext<PredictionContextType>({
    prediction: 0,
    setPrediction: undefined,
    probability: 0,
    setProbability: undefined
})

export const PredictionProvider = ({ children } : ParentProps) =>{
    const [prediction, setPrediction] = useState(0)
    const [probability, setProbability] = useState(0)

    return (
        <PredictionContext.Provider value={{ 
            prediction,
            setPrediction,
            probability,
            setProbability,
        }}>
            {children}
        </PredictionContext.Provider>
    )
}

export const usePrediction = () =>{
    const { 
        prediction,
        setPrediction,
        probability,
        setProbability,
    } = useContext(PredictionContext)

    if(
        typeof setPrediction === "undefined" ||
        typeof setProbability === "undefined"
    ) throw new Error("Element is outside the Prediction Provider")
    return { 
        prediction,
        setPrediction,
        probability,
        setProbability,
    }
}