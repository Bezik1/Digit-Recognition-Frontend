export type PredictionContextType = {
    prediction: number, 
    setPrediction: React.Dispatch<React.SetStateAction<number>> | undefined 
    probability: number, 
    setProbability: React.Dispatch<React.SetStateAction<number>> | undefined 
}