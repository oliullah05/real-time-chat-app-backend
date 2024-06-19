import { Conversation } from "../../../../prisma/generated/client";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { ConversationServices } from "./conversation.service";
import { TParticipantUsers } from "./conversation.type";

const createConversation = catchAsync(async (req, res) => {
   
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


const getConversationByParticipants = catchAsync(async (req, res) => {

    const id = req.user.id as string;
    const participants = req.query.participants as string
    console.log(participants);
    const result = await ConversationServices.getConversationByParticipants(participants, id);
    sendResponse(res, {
        success: true,
        message: "Conversation retrieved successfully",
        statusCode: 200,
        data: result
       
    })
})


const updateConversationByParticipants = catchAsync(async (req, res) => {

    const participants = req.query.participants as string;
    const updatedData = pick(req.body,["lastMessage","groupPhoto","groupName","isGroup","participants"])
    const result = await ConversationServices.updateConversationByParticipants(participants, updatedData);
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
    updateConversationByParticipants,
    getConversationByParticipants
    
}