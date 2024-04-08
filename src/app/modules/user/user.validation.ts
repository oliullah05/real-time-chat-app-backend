import { UserRole } from "@prisma/client";
import { z } from "zod";
const zodUserRole = z.enum(["user", "admin"]);
const createUser = z.object({
  body: z.object({
    email: z.string({required_error:"Email is required"}),
    name: z.string({required_error:"Name is required"}),
    profilePhoto: z.string().optional(),
    password: z.string({required_error:"Password is required"}),
    role: zodUserRole.default(UserRole.user)
  }),
});


export const  UserValidations = {
    createUser
}