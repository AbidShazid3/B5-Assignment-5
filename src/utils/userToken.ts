import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../config/env"
import { IUser, UserStatus } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import { generateToken, verifyToken } from "./jwt"
import AppError from "../errorHelpers/AppError"

export const createUserToken = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        phone: user.phone,
        role: user.role,
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken =async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

    const isUserExist = await User.findOne({ phone: verifiedRefreshToken.phone })
    if (!isUserExist) {
        throw new AppError(401, 'User does not exist')
    }
    if (isUserExist.status === UserStatus.BLOCKED) {
        throw new AppError(401, `User is ${isUserExist.status}`)
    }

    const jwtPayload = {
        userId: isUserExist._id,
        phone: isUserExist.phone,
        role: isUserExist.role,
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return accessToken;
}