
import { Message } from "../../../../prisma/generated/client";
import ApiError from "../../errors/apiError";
import prisma from "../../shared/prisma";
import { TPagination } from "../conversation/conversation.type";

const createMessage = async (payload: Message,userId:string) => {

  payload.senderId= userId
  const isSender = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
  if (!isSender) {
    throw new ApiError(404, "Sender not found")
  }



  const isConversation = await prisma.conversation.findUnique({
    where: {
      id: payload.conversationId
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
    id:userId
  }
})


  // check this coversation his or others
const isConversationValid = await prisma.conversation.findUniqueOrThrow({
  where:{
    id:conversationId
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
          updatedAt:"desc"
        }

    })

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