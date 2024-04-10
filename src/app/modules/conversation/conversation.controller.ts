import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { ConversationServices } from "./conversation.service";

const createConversation = catchAsync(async(req,res)=>{
    const result = await ConversationServices.createConversation(req.body);
     sendResponse(res,{
        success:true,
        message:"Conversation created successfully",
        statusCode:201,
        data:result
     })
})

const getMyConversations = catchAsync(async(req,res)=>{
    console.log({
        cookie:req.cookies
    });
    const pagination = pick(req.query,["page","limit"]) as {page:number,limit:number};
    const email = req.query?.email as string;
    const result = await ConversationServices.getMyConversations(pagination,email);
     sendResponse(res,{
        success:true,
        message:"Conversations retrieved successfully",
        statusCode:200,
        data:result.result,
        meta:{
            page:result.meta.page,
            limit:result.meta.limit,
            total:result.meta.total
        }
     })
})



export const ConversationControllers = {
    createConversation,
    getMyConversations
}