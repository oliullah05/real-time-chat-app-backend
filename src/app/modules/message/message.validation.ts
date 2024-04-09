import z from "zod"
const createMessage = z.object({
    body:z.object({
        message: z.string({required_error:"message is required"}).min(1, { message: 'Message must not be empty' }),
        sender: z.number({required_error:"sender is required"}).int().positive({ message: 'Sender ID must be a positive integer' }),
        receiver: z.number({required_error:"receiver is required"}).int().positive({ message: 'Receiver ID must be a positive integer' }),
        conversationId: z.number({required_error:"conversationId is required"}).int().positive({ message: 'Conversation ID must be a positive integer' })
    
    })
          
})


export const MessageValiditons = {
    createMessage
}