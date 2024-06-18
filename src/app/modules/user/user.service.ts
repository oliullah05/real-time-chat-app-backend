
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import config from "../../config";
import { User } from "../../../../prisma/generated/client";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { TPagination } from "../conversation/conversation.type";
import { query } from "express";
const createUser = async (payload: User) => {

  const { password, ...data } = payload;

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round as string)
  );

  const result = await prisma.user.create({
    data: { ...data, password: hashedPassword },
    select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  // jwt
  const jwtPayload: JwtPayload = {
    id: result.id,
    email: result.email,
    role: result.role
  }

  const accessToken = jwt.sign(jwtPayload, config.jwt.jwt_access_secret as Secret, {
    expiresIn: config.jwt.jwt_access_secret_expire_in
  })


  const refreshToken = jwt.sign(jwtPayload, config.jwt.jwt_refresh_secret as Secret, {
    expiresIn: config.jwt.jwt_refresh_secret_expire_in
  })



  return {
    accessToken,
    user: {
      id: result.id,
      role: result.role,
      email: result.email
    },
    refreshToken
  };
};



const getUsersWithoutMeForMessage = async (pagination: TPagination, userId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  })
  //  calculate pagination
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  const skip = (page - 1) * limit

  const result = await prisma.user.findMany({
    where: {
      NOT: {
        id: userId
      },
      AND: {
        isDeleted: false
      }
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      name: true,
      profilePhoto: true,
      createdAt: true
    }
  })

  return {
    result,
    meta: {
      page,
      limit,
      total: result?.length || 0
    }
  };


}

const searchUsersWithoutMeForMessage = async (pagination: TPagination,searchTerm: string, userId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  })
  //  calculate pagination
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  const skip = (page - 1) * limit



  const result = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        // {
        //   email: {
        //     contains: searchTerm,
        //     mode: "insensitive"
        //   }
        // },
      ],
      NOT: [
        {
          id: userId
        }
      ],
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      name: true,
      profilePhoto: true,
      createdAt: true
    }
  })

  return {
    result,
    meta: {
      page,
      limit,
      total: result?.length || 0
    }
  };
}







export const UserServices = {
  createUser,
  getUsersWithoutMeForMessage,
  searchUsersWithoutMeForMessage
};
