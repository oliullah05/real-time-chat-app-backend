
import { Message } from "../../../../prisma/generated/client";
import prisma from "../../shared/prisma";

const createMessage = async(payload:Message)=>{
   
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





export const MessageServices = {
    createMessage
}