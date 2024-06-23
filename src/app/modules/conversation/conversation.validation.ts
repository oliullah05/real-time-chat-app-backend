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
        lastMessageType: z.enum([
            'web',
            'code',
            'video',
            'voice',
            'audio',
            'image',
            'document',
            'archive',
            'text',
            'script',
            'data',
          ],{required_error:"lastMessageType type is required."}),
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


const updateConversationThenSlientlyCreateMessage = z.object({
    body:z.object({
        lastMessage:z.string({required_error:"lastMessage is required."}),
        lastMessageType:z.enum([
            'web',
            'code',
            'video',
            'audio',
            'voice',
            'image',
            'document',
            'archive',
            'text',
            'script',
            'data',
          ],{required_error:"lastMessageType type is required."}),
        conversationId:z.string({required_error:"conversationId is required."}),
        fileName:z.string().optional(),
        fileSize:z.string().optional(),
    })
})

export const ConversationValidations = {
    createConversation,
    updateConversation,
    updateConversationThenSlientlyCreateMessage
}