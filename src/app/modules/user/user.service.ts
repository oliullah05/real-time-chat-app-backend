
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import config from "../../config";
import { User } from "../../../../prisma/generated/client";
const createUser = async (payload: User) => {

  const { password, ...data } = payload;

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round as string)
  );
  
  const result = await prisma.user.create({
      data: { ...data, password: hashedPassword },
      select:{
        id:true,
        name:true,
        email:true,
        profilePhoto:true,
        role:true,
        createdAt:true,
        updatedAt:true
    }
  });

  return result;
};




export const UserServices = {
  createUser,
};
