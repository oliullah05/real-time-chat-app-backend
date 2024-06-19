import { Conversation } from "../../../../prisma/generated/client";
import ApiError from "../../errors/apiError";
// import ApiError from "../../errors/apiError";
import prisma from "../../shared/prisma";
import { TPagination, TParticipantUsers } from "./conversation.type";

const createConversation = async (payload: {
  lastMessage: string;
  participants: string;
  isGroup?: boolean;
  lastMessageType?: string,
  conversationsUsers: [{
    userId: string;
  }];
  groupName?: string;
  groupPhoto?: string
}, userId: string) => {
  // sort participants

  const participants = payload.participants;
  const participantsArray = participants.split('/');
  const sortedParticipantsArray = participantsArray.sort();
  const sortedParticipants = sortedParticipantsArray.join('/');


  // check is conversation exits 

  const isConversationExits = await prisma.conversation.findUnique({
    where: {
      participants: sortedParticipants
    }
  })

  // all necessary validation added here........................................................................

  function checkParticipantsAndUsersMatch(participants: string, conversationsUsers: {
    userId: string;
  }[]) {
   const participantIDs = participants.split('/');
    const userIDs = conversationsUsers.map(user => user.userId);
    const isMatch = participantIDs.length === userIDs.length &&
      participantIDs.every(id => userIDs.includes(id));
    return isMatch ? true : false;
  }

  if (!checkParticipantsAndUsersMatch(payload.participants, payload.conversationsUsers)) {
    throw new ApiError(400, "Participants and conversations users did not match.")
  }

  if (payload.isGroup === false && participantsArray.length > 2 || payload.isGroup === false && payload.conversationsUsers.length > 2) {
    throw new ApiError(400, "Group can't be false when participants more then 2")
  }

  if (participantsArray.length !== payload.conversationsUsers.length) {
    throw new ApiError(400, "participants and conversationsUsers not match")
  }


  if (payload.isGroup && payload.conversationsUsers.length < 3 || payload.isGroup && participantsArray.length < 3) {
    throw new ApiError(400, "Group must be 3 member or higher")
  }

  const result = await prisma.$transaction(async (txClient) => {
    // payload for create 
    const createModifyPayload: any = {
      lastMessage: payload.lastMessage,
      participants: sortedParticipants,
    }
    if (payload.isGroup) {
      createModifyPayload.isGroup = payload.isGroup;
    }
    if (payload.groupName) {
      createModifyPayload.groupName = payload.groupName;
    }
    if (payload.groupPhoto) {
      createModifyPayload.groupPhoto = payload.groupPhoto;
    }

    if (payload.lastMessageType) {
      createModifyPayload.lastMessageType = payload.lastMessageType;
    }


    // payload for update 
    const updateModifyPayload: any = {
      lastMessage: payload.lastMessage,
    }

    if (payload.groupName) {
      updateModifyPayload.groupName = payload.groupName;
    }
    if (payload.groupPhoto) {
      updateModifyPayload.groupPhoto = payload.groupPhoto;
    }

    if (payload.lastMessageType) {
      updateModifyPayload.lastMessageType = payload.lastMessageType;
    }

    // create or update conversation
    const conversationCreateOrUpdate = await txClient.conversation.upsert({
      where: {
        participants: sortedParticipants
      },
      create: createModifyPayload,
      update: updateModifyPayload
    })

    const createMessageForThisConversation = await txClient.message.create({
      data: {
        message: conversationCreateOrUpdate.lastMessage,
        conversationId: conversationCreateOrUpdate.id,
        senderId: userId,
        type: conversationCreateOrUpdate.lastMessageType
      }
    })


    if (!isConversationExits) {
      const participantUsersData = payload.conversationsUsers.map((user) => ({
        userId: user.userId,
        conversationId: conversationCreateOrUpdate.id,
      }));

      const participantUsers = await txClient.conversationUsers.createMany({
        data: participantUsersData
      });
    }


    const getConversation = await txClient.conversation.findUniqueOrThrow({
      where: {
        id: conversationCreateOrUpdate.id
      },
      select: {
        id: true,
        participants: true,
        lastMessage: true,
        isGroup: true,
        groupName: true,
        groupPhoto: true,

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

  return {
    result,
    message: `${isConversationExits ? "Conversation Update successfully" : "Conversation created successfully"}`,
    statusCode: isConversationExits ? 200 : 201,
  };
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
      groupPhoto: true,
      isDeleted: true,
      conversationsUsers: {
        include: {
          user: {
            select: {
              profilePhoto: true,
              name: true,
              id: true
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
      const receiverProfileId = conversationUsers[0].user.id;
      const receiverProfilePhoto = conversationUsers[0].user.profilePhoto;
      const receiverProfileName = conversationUsers[0].user.name;
      return { ...conversation, receiverProfileId, receiverProfilePhoto, receiverProfileName }
    }
    return conversation
  })

  // console.log(conversationsWithProfilePhoto);
  return {
    result: conversationsWithProfilePhoto,
    meta: {
      page,
      limit,
      total: conversationsWithProfilePhoto?.length || 0
    }
  };
};



const getConversationById = async (conversationId: string, userId: string) => {
  const conversation = await prisma.conversation.findUniqueOrThrow({
    where: {
      id: conversationId
    },
    select: {
      id: true,
      lastMessage: true,
      participants: true,
      isGroup: true,
      groupName: true,
      groupPhoto: true,
      isDeleted: true,
      conversationsUsers: {
        include: {
          user: {
            select: {
              profilePhoto: true,
              name: true,
              id: true
            }
          }
        }
      },
    }
  })

  if (!conversation.isGroup) {
    const conversationUsers = conversation.conversationsUsers.filter(user => user.userId !== userId)
    const receiverProfileId = conversationUsers[0].user.id;
    const receiverProfilePhoto = conversationUsers[0].user.profilePhoto;
    const receiverProfileName = conversationUsers[0].user.name;
    return { ...conversation, receiverProfileId, receiverProfileName, receiverProfilePhoto }
  }

  return conversation
}

const getConversationByParticipants = async (participants: string, userId: string) => {

  // sort participants

  const participantsArray = participants.split('/');
  const sortedParticipantsArray = participantsArray.sort();
  const SortedParticipants = sortedParticipantsArray.join('/');

  console.log(SortedParticipants);
  const conversation = await prisma.conversation.findUniqueOrThrow({
    where: {
      participants: SortedParticipants
    },
    select: {
      id: true,
      lastMessage: true,
      participants: true,
      isGroup: true,
      groupName: true,
      groupPhoto: true,
      isDeleted: true,
      conversationsUsers: {
        include: {
          user: {
            select: {
              profilePhoto: true,
              name: true,
              id: true
            }
          }
        }
      },
    }
  })

  if (!conversation.isGroup) {
    const conversationUsers = conversation.conversationsUsers.filter(user => user.userId !== userId)
    const receiverProfileId = conversationUsers[0].user.id;
    const receiverProfilePhoto = conversationUsers[0].user.profilePhoto;
    const receiverProfileName = conversationUsers[0].user.name;
    return { ...conversation, receiverProfileId, receiverProfileName, receiverProfilePhoto }
  }

  return conversation
}



const updateConversationByParticipants = async (participants: string, payload: Partial<Conversation>) => {
  // sort participants

  const participantsArray = participants.split('/');
  const sortedParticipantsArray = participantsArray.sort();
  const SortedParticipants = sortedParticipantsArray.join('/');

  await prisma.conversation.findFirstOrThrow({
    where: {
      participants: SortedParticipants
    }
  })

  const result = await prisma.conversation.update({
    where: {
      participants: SortedParticipants,
      isDeleted: false
    },
    data: payload

  })
  return result
}







export const ConversationServices = {
  createConversation,
  getMyConversations,
  getConversationById,
  updateConversationByParticipants,
  getConversationByParticipants
};
