import z from "zod"

const ConversationUsers = z.object({
    userId: z.number({required_error:"conversationsUsers[]>userId is required"})
  });

const createConversation = z.object({
    body:z.object({
        participants:z.string({required_error:"participants is required"}),
        lastMessage:z.string({required_error:"lastMessage is required"}),
        conversationsUsers:z.array(ConversationUsers,{required_error:"ConversationUsers is required"})
    })
})

export const ConversationValidations = {
    createConversation
}