
import { Message } from "../../../../prisma/generated/client";
import ApiError from "../../errors/apiError";
import prisma from "../../shared/prisma";
import { TPagination } from "../conversation/conversation.type";

const createMessage = async (payload: Message) => {

  const isSender = await prisma.user.findUnique({
    where: {
      id: payload.senderId
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





  const result = await prisma.message.create({
    data: payload
  })



  return result;
}


// const getMessagesByConversationId = async(pagination: TPagination,conversationId:number)=>{
//       //  calculate pagination
//   const page = Number(pagination.page) || 1;
//   const limit = Number(pagination.limit) || 10;
//   const skip = (page - 1) * limit

//   await prisma.conversation.findUniqueOrThrow({
//     where:{
//         id:conversationId
//     }
//   })

//     const result = await prisma.message.findMany({
//         where:{
//             conversationId
//         },
//         skip,
//         take: limit,
//         orderBy:{
//           updatedAt:"desc"
//         }

//     })

//     return {
//         result,
//         meta:{
//           page,
//           limit,
//           total:result?.length || 0
//         }
//       };
// }






export const MessageServices = {
  createMessage,
  // getMessagesByConversationId
}