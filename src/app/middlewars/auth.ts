import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ApiError from "../errors/apiError";
import config from "../config";
const auth = (...roles: string[]) => {


    return async (req: Request, res: Response, next: NextFunction) => {

        try {
            if (!req.headers.authorization) {
                throw new ApiError(401, "You are not authorized")
            }

            const tokenWithBearer = req.headers.authorization;

            const token = tokenWithBearer.replace(/^Bearer\s/, '');
            const verifyToken = jwt.verify(token, config.jwt.jwt_access_secret as Secret)
     
      
            // check authrization
          if(roles.length>0 && !roles.includes((verifyToken as JwtPayload).role)){
            throw new ApiError(401, "You are not authorized")
          }



            req.user = verifyToken as JwtPayload
            return next()
        }
        catch (err) {
            next(err)
        }

    }



}


export default auth;