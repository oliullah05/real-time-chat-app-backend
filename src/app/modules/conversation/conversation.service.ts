import { Conversation } from "../../../../prisma/generated/client";
import ApiError from "../../errors/apiError";
import prisma from "../../shared/prisma";
import { TPagination, TParticipantUsers } from "./conversation.type";

const createConversation = async (
  payload: Conversation & {
    conversationsUsers: TParticipantUsers;
  }
) => {

  const result = await prisma.$transaction(async (txClient) => {
    const conversation = await txClient.conversation.create({
      data: {
        participants: payload.participants,
        lastMessage: payload.lastMessage,
      },
    });

    const participantUsersData = payload.conversationsUsers.map((user) => ({
      ...user,
      conversationId: conversation.id,
    }));

    const participantUsers = await txClient.conversationUsers.createMany({
      data: participantUsersData,
    });

    const getConversation = await txClient.conversation.findUniqueOrThrow({
      where: {
        id: conversation.id,
      },
      select: {
        id: true,
        lastMessage: true,
        participants:true,
        conversationsUsers: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return getConversation;
  });

  return result;
};

const getMyConversations = async (pagination: TPagination,email:string) => {
  //  calculate pagination
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  const skip = (page - 1) * limit
     





  const result = await prisma.conversation.findMany({
    where:{
      participants:{
        contains:email
      }
    },
    select: {
      id: true,
      lastMessage: true,
      participants:true,
      conversationsUsers: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
    skip,
    take: limit,
    orderBy:{
      updatedAt:"desc"
    }
  });

if(result?.length===0){
  throw new ApiError(404,"Conversation not found")
}


  return {
    result,
    meta:{
      page,
      limit,
      total:result?.length || 0
    }
  };
};

export const ConversationServices = {
  createConversation,
  getMyConversations,
};
