import z from "zod"
const createMessage = z.object({
    body: z.object({
        message: z.string({ required_error: "Message is required" }).min(1, { message: 'Message must not be empty' }),
        fileName: z.string().min(1, { message: 'fileName must not be empty' }).optional(),
        conversationId: z.string({ required_error: "ConversationId is required" }),
        type: z.enum([
            'web',
            'code',
            'video',
            'audio',
            'image',
            'document',
            'archive',
            'text',
            'script',
            'data',
          ],{required_error:"Message type is required."})
    })

})


export const MessageValiditons = {
    createMessage
}

