
import { Message } from "../../../../prisma/generated/client";
import ApiError from "../../errors/apiError";
import prisma from "../../shared/prisma";
import { TPagination } from "../conversation/conversation.type";

const createMessage = async (payload: Message,userId:string) => {

  payload.senderId= userId
  const isSender = await prisma.user.findUnique({
    where: {
      id: userId,
      isDeleted:false
    }
  })
  if (!isSender) {
    throw new ApiError(404, "Sender not found")
  }



  const isConversation = await prisma.conversation.findUnique({
    where: {
      id: payload.conversationId,
      isDeleted:false
    }
  })

  if (!isConversation) {
    throw new ApiError(404, "Conversation not found")
  }

  const result =await  prisma.message.create({
    data: payload
  })



  return result;
}


const getMessagesByConversationId = async(pagination: TPagination,conversationId:string,userId:string)=>{
      //  calculate pagination
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  const skip = (page - 1) * limit

await prisma.user.findUniqueOrThrow({
  where:{
    id:userId,
    isDeleted:false
  }
})


  // check this coversation his or others
const isConversationValid = await prisma.conversation.findUniqueOrThrow({
  where:{
    id:conversationId,
    isDeleted:false
  }
})



if(!isConversationValid.participants.includes(userId)){
  throw new ApiError(401,"You are not authorized")
}

    const result = await prisma.message.findMany({
        where:{
           conversationId,
        },
        skip,
        take: limit,
        orderBy:{
          updatedAt:"asc"
        }

    })
    // 9291d8b2-8ad7-4b7c-8647-1393d5a70dca/b89bd333-e286-47db-9034-ffd35338a9ea
    return {
        result,
        meta:{
          page,
          limit,
          total:result?.length || 0
        }
      };
}






export const MessageServices = {
  createMessage,
  getMessagesByConversationId
}