import { access } from "fs";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const login = catchAsync(async(req,res)=>{
    const result = await AuthServices.login(req.body);

   

     sendResponse(res,{
        success:true,
        message:"Logged in successfull",
        statusCode:200,
        data:{
            accessToken:result.accessToken
        }
     })
})


export const AuthControllers = {
    login
}