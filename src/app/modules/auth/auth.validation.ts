import z from "zod"

const login = z.object({
    body: z.object({
        email: z.string({required_error:"email is required"}).min(1, { message: "Email must not be empty" }),
        password: z.string({required_error:"password is required"}).min(6, { message: 'Password must be at least 6 characters long' }),
    })
})


const refreshToken = z.object({
    cookies:z.object({
        refreshToken:z.string({required_error:"refeshToken is required"})
    })
})

export const AuthValidations = {
login,
refreshToken
}