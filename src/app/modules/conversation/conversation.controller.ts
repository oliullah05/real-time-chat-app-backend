import { Conversation } from "../../../../prisma/generated/client";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { ConversationServices } from "./conversation.service";

const createConversation = catchAsync(async (req, res) => {
    const data = pick(req.query, ["lastMessage", "conversationsUsers"])
    const result = await ConversationServices.createConversation(req.body);
    sendResponse(res, {
        success: true,
        message: "Conversation created successfully",
        statusCode: 201,
        data: result
    })
})

const getMyConversations = catchAsync(async (req, res) => {
    const pagination = pick(req.query, ["page", "limit"]) as { page: number, limit: number };
    const id = req.user.id as string;

    const result = await ConversationServices.getMyConversations(pagination, id);
    sendResponse(res, {
        success: true,
        message: "My conversations retrieved successfully",
        statusCode: 200,
        data: result.result,
        meta: {
            page: result.meta.page,
            limit: result.meta.limit,
            total: result.meta.total
        }
    })
})


const getConversationById = catchAsync(async (req, res) => {

    const id = req.user.id as string;
    const conversationId = req.params.id
    const result = await ConversationServices.getConversationById(conversationId, id);
    sendResponse(res, {
        success: true,
        message: "Conversation retrieved successfully",
        statusCode: 200,
        data: result
       
    })
})


const updateConversationById = catchAsync(async (req, res) => {

    const id = req.params.id as string;
    const updatedData = pick(req.body,["lastMessage","groupPhoto","groupName","isGroup","participants"])
    const result = await ConversationServices.updateConversationById(id, updatedData);
    sendResponse(res, {
        success: true,
        message: "Conversation Update successfully",
        statusCode: 200,
        data: result
       
    })
})



export const ConversationControllers = {
    createConversation,
    getMyConversations,
    getConversationById,
    updateConversationById,
    
}