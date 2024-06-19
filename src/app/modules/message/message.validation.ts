import z from "zod"
const createMessage = z.object({
    body:z.object({
        message: z.string({required_error:"Message is required"}).min(1, { message: 'Message must not be empty' }),
        conversationId: z.string({required_error:"ConversationId is required"}),
        type:z.string().min(1, { message: 'Type must not be empty' }).optional(),
    })
          
})


export const MessageValiditons = {
    createMessage
}