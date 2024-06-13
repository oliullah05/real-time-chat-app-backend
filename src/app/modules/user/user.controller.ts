import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { userFields } from "./user.const";

import sendResponse from "../../shared/sendResponse";
import { User } from "../../../../prisma/generated/client";
import config from "../../config";


const createUser = catchAsync( async(req:Request,res:Response,next:NextFunction)=>{
    const userData  = pick(req.body,userFields) as User
    const result = await UserServices.createUser(userData);

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.node_env==="production"
    })


    sendResponse(res, {
        success: true,
        message: "User created successfull!",
        statusCode: 201,
        data: {
            accessToken: result.accessToken,
            user:result.user
        }
    })
  
}

)

export const UserControllers = {
    createUser
}