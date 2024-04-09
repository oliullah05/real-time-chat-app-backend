import { Response } from "express";

const sendResponse = <T> (res:Response,jsonResponse:{
    statusCode:number
    success:boolean
    message:string
    meta?:{
        page:number,
        limit:number,
        total:number
    }
    data:T
})=>{
    res.status(jsonResponse.statusCode).json({
        success:jsonResponse.success,
        statusCode:jsonResponse.statusCode,
        message:jsonResponse.message,
        meta:jsonResponse?.meta?jsonResponse.meta:null,
        data:jsonResponse.data,
    })
}

export default sendResponse;