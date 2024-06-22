import { Conversation } from "../../../../prisma/generated/client";
import ApiError from "../../errors/apiError";
// import ApiError from "../../errors/apiError";
import prisma from "../../shared/prisma";
import sendResponse from "../../shared/sendResponse";
import { TPagination, TParticipantUsers } from "./conversation.type";

const createOrUpdateConversationThenSlientlyCreateMessage = async (payload: {
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

  const isConversationExits = await prisma.conversation.findFirst({
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

  // if (participantsArray.length !== payload.conversationsUsers.length) {
  //   throw new ApiError(400, "participants and conversationsUsers not match")
  // }


  if (payload.isGroup && payload.conversationsUsers.length < 3 || payload.isGroup && participantsArray.length < 3) {
    throw new ApiError(400, "Group must be 3 member or higher")
  }




  // define for conversation message show
  // let conversationLastMessage = "";

  // if (payload.lastMessageType === "text") {
  //   conversationLastMessage = payload.lastMessage
  // }
  // else if (payload.lastMessageType === "voice") {
  //   conversationLastMessage = "Send an audio clip"
  // }
  // else if (payload.lastMessageType === "audio") {
  //   conversationLastMessage = "Send an audio file"
  // }
  // else if (payload.lastMessageType === "video") {
  //   conversationLastMessage = "Send an video file"
  // }
  // else if (payload.lastMessageType === "image") {
  //   conversationLastMessage = "Send an image"
  // }
  // else if (
  //   payload.lastMessageType === "web" ||
  //   payload.lastMessageType === "code" ||
  //   payload.lastMessageType === "document" ||
  //   payload.lastMessageType === "archive" ||
  //   payload.lastMessageType === "script" ||
  //   payload.lastMessageType === "data") {
  //   conversationLastMessage = "Send a file"
  // }





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
    // const conversationCreateOrUpdate = await txClient.conversation.upsert({
    //   where: {
    //     participants: sortedParticipants
    //   },
    //   create: createModifyPayload,
    //   update: updateModifyPayload
    // })


    let conversationCreateOrUpdate: any = [];


    if (isConversationExits) {
      conversationCreateOrUpdate = await txClient.conversation.update({
        where: {
          id: isConversationExits.id
        },
        data: updateModifyPayload
      })

    }

    else if (!isConversationExits) {
      conversationCreateOrUpdate = await txClient.conversation.create({
        data: createModifyPayload
      })
    }



    const createMessageForThisConversation = await txClient.message.create({
      data: {
        message: payload.lastMessage,
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
                email: true,
                profilePhoto: true
              }
            }
          }
        },

        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });



    if (!getConversation.isGroup) {
      const conversationUsers = getConversation.conversationsUsers.filter(user => user.userId !== userId)
      const receiverProfileId = conversationUsers[0].userId;
      const receiverProfileName = conversationUsers[0].user.name;
      const receiverProfilePhoto = conversationUsers[0].user.profilePhoto;
      return { conversation: { ...getConversation, receiverProfileId, receiverProfilePhoto, receiverProfileName }, message: createMessageForThisConversation, }
    }


    return { conversation: getConversation, message: createMessageForThisConversation };
  });
  return {
    result,
    message: `${isConversationExits ? "Conversation Update successfully" : "Conversation created successfully"}`,
    statusCode: isConversationExits ? 200 : 201,
  };
};



const createGroupConversationThenSlientlyCreateMessage = async (payload: {
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


  if (payload.conversationsUsers.length < 3 || participantsArray.length < 3) {
    throw new ApiError(400, "Group must be 3 member or higher")
  }




  // define for conversation message show

  let conversationLastMessage = "";
  if (payload.lastMessageType === "text") {
    conversationLastMessage = payload.lastMessage
  }
  else if (payload.lastMessageType === "voice") {
    conversationLastMessage = "Send an audio clip"
  }
  else if (payload.lastMessageType === "audio") {
    conversationLastMessage = "Send an audio file"
  }
  else if (payload.lastMessageType === "video") {
    conversationLastMessage = "Send an video file"
  }
  else if (payload.lastMessageType === "image") {
    conversationLastMessage = "Send an image"
  }
  else if (
    payload.lastMessageType === "web" ||
    payload.lastMessageType === "code" ||
    payload.lastMessageType === "document" ||
    payload.lastMessageType === "archive" ||
    payload.lastMessageType === "script" ||
    payload.lastMessageType === "data") {
    conversationLastMessage = "Send a file"
  }








  const result = await prisma.$transaction(async (txClient) => {
    // payload for create 
    const createModifyPayload: any = {
      lastMessage: conversationLastMessage,
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



    // create group conversation
    const createGroupConversation = await txClient.conversation.create({
      data: createModifyPayload
    })

    const createMessageForThisGroupConversation = await txClient.message.create({
      data: {
        message: payload.lastMessage,
        conversationId: createGroupConversation.id,
        senderId: userId,
        type: createGroupConversation.lastMessageType
      }
    })



    const participantUsersData = payload.conversationsUsers.map((user) => ({
      userId: user.userId,
      conversationId: createGroupConversation.id,
    }));

    const participantUsers = await txClient.conversationUsers.createMany({
      data: participantUsersData
    });



    const getConversation = await txClient.conversation.findUniqueOrThrow({
      where: {
        id: createGroupConversation.id
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

  return result
};




// update conversation and message to message input


const updateConversationThenSlientlyCreateMessage = async (payload: {
  conversationId: string
  lastMessage: string;
  lastMessageType: string,
  fileName?: string,
  fileSize?: string
}, userId: string) => {


  // check is conversation exits 

  await prisma.conversation.findUniqueOrThrow({
    where: {
      id: payload.conversationId
    }
  })

  await prisma.user.findUniqueOrThrow({
    where:{
      id:userId
    }
  })


  // define for conversation message show
  let conversationLastMessage = "";

  if (payload.lastMessageType === "text") {
    conversationLastMessage = payload.lastMessage
  }
  else if (payload.lastMessageType === "voice") {
    conversationLastMessage = "Send an audio clip"
  }
  else if (payload.lastMessageType === "audio") {
    conversationLastMessage = "Send an audio file"
  }
  else if (payload.lastMessageType === "video") {
    conversationLastMessage = "Send an video file"
  }
  else if (payload.lastMessageType === "image") {
    conversationLastMessage = "Send an image"
  }
  else if (
    payload.lastMessageType === "web" ||
    payload.lastMessageType === "code" ||
    payload.lastMessageType === "document" ||
    payload.lastMessageType === "archive" ||
    payload.lastMessageType === "script" ||
    payload.lastMessageType === "data") {
    conversationLastMessage = "Send a file"
  }



  const result = await prisma.$transaction(async (txClient) => {
    // payload for update conversation
    const updateConversationPayload: any = {
      lastMessage: conversationLastMessage,
      lastMessageType: payload.lastMessageType
    }


    const updateConversation = await txClient.conversation.update({
      where: {
        id: payload.conversationId
      },
      data: updateConversationPayload
    })


    console.log(2000, updateConversation, 20000);


    // payload for create message for this conversation
    const createMessagePayload: any = {
      message: payload.lastMessage,
      type: payload.lastMessageType,
      conversationId: updateConversation.id,
      senderId: userId
    }

    if (payload.fileName) {
      createMessagePayload.fileName = payload.fileName;
    }
    if (payload.fileSize) {
      createMessagePayload.fileSize = payload.fileSize;
    }


    const createMessageForThisConversation = await txClient.message.create({
      data: createMessagePayload
    })




    const getConversation = await txClient.conversation.findUniqueOrThrow({
      where: {
        id: updateConversation.id
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
                email: true,
                profilePhoto: true
              }
            }
          }
        },

        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });



    if (!getConversation.isGroup) {
      const conversationUsers = getConversation.conversationsUsers.filter(user => user.userId !== userId)
      const receiverProfileId = conversationUsers[0].userId;
      const receiverProfileName = conversationUsers[0].user.name;
      const receiverProfilePhoto = conversationUsers[0].user.profilePhoto;
      return { conversation: { ...getConversation, receiverProfileId, receiverProfilePhoto, receiverProfileName }, message: createMessageForThisConversation, }
    }


    return { conversation: getConversation, message: createMessageForThisConversation };
  });

  return result
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
  const conversation = await prisma.conversation.findFirstOrThrow({
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

  const conversation = await prisma.conversation.findFirstOrThrow({
    where: {
      participants: SortedParticipants
    }
  })

  const result = await prisma.conversation.update({
    where: {
      id: conversation.id,
      isDeleted: false
    },
    data: payload

  })
  return result
}







export const ConversationServices = {
  createOrUpdateConversationThenSlientlyCreateMessage,
  createGroupConversationThenSlientlyCreateMessage,
  updateConversationThenSlientlyCreateMessage,

  getMyConversations,
  getConversationById,
  updateConversationByParticipants,
  getConversationByParticipants
};
