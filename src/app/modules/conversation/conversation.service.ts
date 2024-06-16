import { Conversation } from "../../../../prisma/generated/client";
import ApiError from "../../errors/apiError";
// import ApiError from "../../errors/apiError";
import prisma from "../../shared/prisma";
import { TPagination, TParticipantUsers} from "./conversation.type";

const createConversation = async (
  payload: Conversation & {
    conversationsUsers: TParticipantUsers;
  }
) => {
// sort participants

  const participants = payload.participants;
  const participantsArray = participants.split('-');
  const sortedParticipantsArray = participantsArray.sort((a, b) => Number(a) - Number(b));
  const SortedParticipants = sortedParticipantsArray.join('-');

// check if conversation exits

const isConversationExits = await prisma.conversation.findFirst({
where:{
  participants:SortedParticipants,
  isDeleted:false
}
})

if(isConversationExits){
  throw new ApiError(400,"conversation alrady exits")
}



  const result = await prisma.$transaction(async (txClient) => {
    const conversation = await txClient.conversation.create({
      data: {
        lastMessage: payload.lastMessage,
        participants:SortedParticipants
      },
    });

    const participantUsersData = payload.conversationsUsers.map((user) => ({
      userId:Number(user.userId),
      conversationId: conversation.id,
    }));

    const participantUsers = await txClient.conversationUsers.createMany({
      data: participantUsersData
    });

    const getConversation = await txClient.conversation.findUniqueOrThrow({
      where: {
        id: conversation.id,
      },
      select: {
        id: true,
        participants:true,
        lastMessage: true,
        isGroup:true,
        groupName:true,

        conversationsUsers: {
          include:{
            user:{
              select:{
                name:true,
                email:true
              }
            }
          }
        },

        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return getConversation;
  });

  return result;
};



// const getMyConversations = async (pagination: TPagination,id:string) => {
//   //  calculate pagination
//   const page = Number(pagination.page) || 1;
//   const limit = Number(pagination.limit) || 10;
//   const skip = (page - 1) * limit
     





//   const result = await prisma.conversation.findMany({
//     where:{
//       participants:{
//         contains:String(id)
//       }
//     },
//     select: {
//       id: true,
//       lastMessage: true,
//       participants:true,
//       conversationsUsers: true,
//       isDeleted: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//     skip,
//     take: limit,
//     orderBy:{
//       updatedAt:"desc"
//     }
//   });

// if(result?.length===0){
//   throw new ApiError(404,"Conversation not found")
// }


//   return {
//     result,
//     meta:{
//       page,
//       limit,
//       total:result?.length || 0
//     }
//   };
// };

export const ConversationServices = {
  createConversation,
  // getMyConversations,
};
