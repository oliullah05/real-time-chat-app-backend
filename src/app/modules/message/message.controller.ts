import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { MessageServices } from "./message.service";

const createMessage = catchAsync(async(req,res)=>{
    const result = await MessageServices.createMessage(req.body);
     sendResponse(res,{
        success:true,
        message:"Message created successfully",
        statusCode:201,
        data:result
     })
})



export const MessageControllers = {
 createMessage
}