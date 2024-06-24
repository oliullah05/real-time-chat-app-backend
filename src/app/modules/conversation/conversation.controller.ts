import { Conversation } from "../../../../prisma/generated/client";
import { io } from "../../../app";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { ConversationServices } from "./conversation.service";
import { TParticipantUsers } from "./conversation.type";

const createOrUpdateConversationThenSlientlyCreateMessage = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await ConversationServices.createOrUpdateConversationThenSlientlyCreateMessage(req.body, userId);

    sendResponse(res, {
        success: true,
        message: result.message,
        statusCode: result.statusCode,
        data: result.result
    })
})



const createGroupConversationThenSlientlyCreateMessage = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await ConversationServices.createGroupConversationThenSlientlyCreateMessage(req.body, userId);
    sendResponse(res, {
        success: true,
        message: "Group Created successfully",
        statusCode: 201,
        data: result
    })
})


const updateConversationThenSlientlyCreateMessage = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await ConversationServices.updateConversationThenSlientlyCreateMessage(req.body, userId);

    sendResponse(res, {
        success: true,
        message: "Message created successfull",
        statusCode: 201,
        data: result
    })
})





const getMyConversations = catchAsync(async (req, res) => {
    const pagination = pick(req.query, ["page", "limit"]) as { page: number, limit: number };
    const userId = req.user.id as string;

    const result = await ConversationServices.getMyConversations(pagination, userId);
    if (result.result.length === 0) {
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
    }
    else {
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
    }
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
    const updatedData = pick(req.body, ["lastMessage", "groupPhoto", "groupName", "isGroup", "participants"])
    const result = await ConversationServices.updateConversationByParticipants(participants, updatedData);
    sendResponse(res, {
        success: true,
        message: "Conversation Update successfully",
        statusCode: 200,
        data: result

    })
})



export const ConversationControllers = {
    createOrUpdateConversationThenSlientlyCreateMessage,
    createGroupConversationThenSlientlyCreateMessage,
    updateConversationThenSlientlyCreateMessage,
    getMyConversations,
    getConversationById,
    updateConversationByParticipants,
    getConversationByParticipants

}