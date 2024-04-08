import z from "zod"

const ConversationUsers = z.object({
    email: z.string({required_error:"conversationsUsers>Email is required"}),
    name: z.string({required_error:"conversationsUsers>Name is required"}),
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