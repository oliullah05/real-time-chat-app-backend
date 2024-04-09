import z from "zod"

const login = z.object({
    body: z.object({
        email: z.string({required_error:"email is required"}).min(1, { message: "Email must not be empty" }),
        password: z.string({required_error:"password is required"}).min(6, { message: 'Password must be at least 6 characters long' }),
    })
})


export const AuthValidations = {
login
}