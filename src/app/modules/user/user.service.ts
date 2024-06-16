
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import config from "../../config";
import { User } from "../../../../prisma/generated/client";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
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

    // jwt
    const jwtPayload: JwtPayload = {
      id: result.id,
      email:result.email,
      role: result.role
  }

  const accessToken =  jwt.sign(jwtPayload, config.jwt.jwt_access_secret as Secret, {
      expiresIn: config.jwt.jwt_access_secret_expire_in
  })


  const refreshToken =  jwt.sign(jwtPayload, config.jwt.jwt_refresh_secret as Secret, {
      expiresIn: config.jwt.jwt_refresh_secret_expire_in
  })



  return {
      accessToken,
      user:{
          id: result.id,
          role: result.role,
          email:result.email
      },
      refreshToken
  };
};




export const UserServices = {
  createUser,
};
