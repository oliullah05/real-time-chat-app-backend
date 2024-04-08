import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { userFields } from "./user.const";
import { User } from "@prisma/client";
import sendResponse from "../../shared/sendResponse";


const createUser = catchAsync( async(req:Request,res:Response,next:NextFunction)=>{
    console.log(req.body);
    const userData  = pick(req.body,userFields) as User
    const result = await UserServices.createUser(userData);
    sendResponse(res,{
        success:true,
        message:"User created successfull",
        statusCode:201,
        data:result
    })
  
}

)

export const UserControllers = {
    createUser
}