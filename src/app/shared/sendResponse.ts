import { Response } from "express";

type TJsonResponse<T> = {
    statusCode: number
    success: boolean
    message: string
    meta?: {
        page: number,
        limit: number,
        total: number
    }
    data: T
}


const sendResponse = <T>(res: Response, jsonResponse: TJsonResponse<T>) => {
    const data: TJsonResponse<T> = {
        success: jsonResponse.success,
        statusCode: jsonResponse.statusCode,
        message: jsonResponse.message,
        data: jsonResponse.data,
    }

    if (jsonResponse.meta) {
        data.meta = jsonResponse.meta
    }

    res.status(jsonResponse.statusCode).json(data)
}

export default sendResponse;