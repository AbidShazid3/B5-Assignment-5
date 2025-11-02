import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import statusCode from 'http-status-codes';
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { UserStatus } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;
        if (!accessToken) {
            throw new AppError(statusCode.UNAUTHORIZED, 'No token received')
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;
        const isUserExist = await User.findOne({ phone: verifiedToken.phone })
        if (!isUserExist) {
            throw new AppError(statusCode.UNAUTHORIZED, 'User not found');
        }
        if (isUserExist.status === UserStatus.BLOCKED) {
            throw new AppError(statusCode.FORBIDDEN, 'Your are blocked');
        }

        if (!authRoles.includes(verifiedToken.role)) {
             throw new AppError(statusCode.FORBIDDEN, 'You are not permitted to access it')
        }

        req.user = verifiedToken;
        next();
    } catch (error) {
        next(error)
    }
}