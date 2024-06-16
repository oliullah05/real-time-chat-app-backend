import { Conversation } from "../../../../prisma/generated/client";
import ApiError from "../../errors/apiError";
// import ApiError from "../../errors/apiError";
import prisma from "../../shared/prisma";
import { TPagination, TParticipantUsers } from "./conversation.type";

const createConversation = async (
  payload: Conversation & {
    conversationsUsers: TParticipantUsers;
  }
) => {
  // sort participants

  const participants = payload.participants;
  const participantsArray = participants.split('/');
  const sortedParticipantsArray = participantsArray.sort();
  const SortedParticipants = sortedParticipantsArray.join('/');


  const isConversationExits = await prisma.conversation.findFirst({
    where: {
      participants: SortedParticipants,
      isDeleted: false
    }
  })

  if (isConversationExits) {
    if (isConversationExits.isGroup) {
      throw new ApiError(400, "This group chat already exists.");
    }
    throw new ApiError(400, "This conversation already exists.");
  }



  // check group 2 or higher here...........................................................................................................

  if (payload.isGroup && payload.conversationsUsers.length < 3) {
    throw new ApiError(400, "Group must be 3 member or higher")
  }

  const result = await prisma.$transaction(async (txClient) => {
    const conversation = await txClient.conversation.create({
      data: {
        lastMessage: payload.lastMessage,

        participants: SortedParticipants
      },
    });

    const participantUsersData = payload.conversationsUsers.map((user) => ({
      userId: user.userId,
      conversationId: conversation.id,
    }));

    const participantUsers = await txClient.conversationUsers.createMany({
      data: participantUsersData
    });

    const getConversation = await txClient.conversation.findUniqueOrThrow({
      where: {
        id: conversation.id
      },
      select: {
        id: true,
        participants: true,
        lastMessage: true,
        isGroup: true,
        groupName: true,

        conversationsUsers: {
          include: {
            user: {
              select: {
                name: true,
                email: true
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



const getMyConversations = async (pagination: TPagination, id: string) => {
  //  calculate pagination
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  const skip = (page - 1) * limit






  const myAllconversations = await prisma.conversation.findMany({
    where: {
      participants: {
        contains: String(id)
      }
    },
    select: {
      id: true,
      lastMessage: true,
      participants: true,
      isGroup: true,
      groupName: true,
      groupPhoto:true,
      isDeleted: true,
      conversationsUsers: {
        include: {
          user: {
            select: {
              profilePhoto: true,
              name:true,
              id:true
            }
          }
        }
      },

      createdAt: true,
      updatedAt: true,
    },
    skip,
    take: limit,
    orderBy: {
      updatedAt: "desc"
    }
  });

  if (myAllconversations?.length === 0) {
    throw new ApiError(404, "Conversation not found")
  }


  const conversationsWithProfilePhoto = myAllconversations.map((conversation, index) => {
    if (!conversation.isGroup) {
      const conversationUsers = conversation.conversationsUsers.filter(user => user.userId !== id)
     const receiverProfileId = conversationUsers[0].user.profilePhoto;
     const receiverProfilePhoto = conversationUsers[0].user.profilePhoto;
     const receiverProfileName= conversationUsers[0].user.name;
     return {...conversation,receiverProfileId,receiverProfilePhoto,receiverProfileName}
    }
    return conversation
  })

  // console.log(conversationsWithProfilePhoto);
  return {
    result:conversationsWithProfilePhoto,
    meta: {
      page,
      limit,
      total: conversationsWithProfilePhoto?.length || 0
    }
  };
};

export const ConversationServices = {
  createConversation,
  getMyConversations,
};
