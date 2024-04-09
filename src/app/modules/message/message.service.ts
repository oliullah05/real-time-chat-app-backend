
import { Message } from "../../../../prisma/generated/client";
import prisma from "../../shared/prisma";
import { TPagination } from "../conversation/conversation.type";

const createMessage = async(payload:Message)=>{

      await prisma.user.findFirstOrThrow({
        where: {
          AND: [
            { id: Number(payload.sender) },
            { id:Number(payload.receiver) }
          ]
        }
      });


    
    const result = await prisma.message.create({
        data:payload,
        include: {
          senderInfo: {
            select:{
                name:true,
                email:true
            }
          },
          receiverInfo:{
            select:{
                name:true,
                email:true
            }
          },
        },
      })

    return result;
}


const getMessagesByConversationId = async(pagination: TPagination,conversationId:number)=>{
      //  calculate pagination
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  const skip = (page - 1) * limit

  await prisma.conversation.findUniqueOrThrow({
    where:{
        id:conversationId
    }
  })

    const result = await prisma.message.findMany({
        where:{
            conversationId
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