import z from "zod"

const ConversationUsers = z.object({
    userId: z.string({required_error:"conversationsUsers[]>userId is required"})
  });

const createConversation = z.object({
    body:z.object({
        lastMessage:z.string({required_error:"lastMessage is required"}),
        participants:z.string({required_error:"participants is required"}),
        isGroup:z.boolean().optional().default(false),
        groupName:z.string().optional(),
        groupPhoto:z.string().optional(),
        conversationsUsers:z.array(ConversationUsers,{required_error:"ConversationUsers is required"})
    })
})


const updateConversation = z.object({
    body:z.object({
        lastMessage:z.string().optional(),
        participants:z.string().optional(),
        isGroup:z.boolean().optional(),
        groupName:z.string().optional(),
        groupPhoto:z.string().optional(),
    }).optional()
})

export const ConversationValidations = {
    createConversation,
    updateConversation
}