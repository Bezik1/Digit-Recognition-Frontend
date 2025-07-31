export type Response<T> = {
    status: number
    message: string
    data: T
}

export type PredictionData = {
    probability: number
    digit: number
}

export type ServerResponse = Response<PredictionData>