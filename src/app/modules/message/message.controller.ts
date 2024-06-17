import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { MessageServices } from "./message.service";

const createMessage = catchAsync(async(req,res)=>{
   const userId = req.user.id;
    const result = await MessageServices.createMessage(req.body,userId);
     sendResponse(res,{
        success:true,
        message:"Message created successfully",
        statusCode:201,
        data:result
     })
})

const getMessagesByConversationId = catchAsync(async(req,res)=>{
   const pagination = pick(req.query,["page","limit"]) as {page:number,limit:number};
   const {conversationId} = req.params;
   const userId = req.user.id
   const result = await MessageServices.getMessagesByConversationId(pagination,conversationId,userId);
    sendResponse(res,{
       success:true,
       message:"Messages retrieved successfully",
       statusCode:200,
       data:result.result,
       meta:{
           page:result.meta.page,
           limit:result.meta.limit,
           total:result.meta.total
       }
    })
})

export const MessageControllers = {
 createMessage,
 getMessagesByConversationId
}