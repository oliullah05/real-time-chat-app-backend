import z from "zod"
const createMessage = z.object({
    body: z.object({
        message: z.string({ required_error: "Message is required" }).min(1, { message: 'Message must not be empty' }),
        conversationId: z.string({ required_error: "ConversationId is required" }),
        type: z.enum([
            'web',
            'code',
            'video',
            'audio',
            'image',
            'document',
            'archive',
            'text'
        ],{required_error:"Message type is required."})
    })

})


export const MessageValiditons = {
    createMessage
}