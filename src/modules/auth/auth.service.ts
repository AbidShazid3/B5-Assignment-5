import AppError from "../../errorHelpers/AppError"
import { IUser, UserStatus } from "../user/user.interface"
import { User } from "../user/user.model"
import statusCode from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const login = async (payload: Partial<IUser>) => {
    const isUserExist = await User.findOne({ phone: payload.phone })
    if (!isUserExist) {
        throw new AppError(statusCode.UNAUTHORIZED, 'User not found');
    }
    if (isUserExist.status === UserStatus.BLOCKED) {
        throw new AppError(statusCode.FORBIDDEN, 'Your are blocked');
    }
    const isPasswordMatch = await bcryptjs.compare(payload.password as string, isUserExist.password);
    if (!isPasswordMatch) {
        throw new AppError(statusCode.UNAUTHORIZED, 'Wrong Password');
    }

    const userToken = createUserToken(isUserExist);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = isUserExist.toObject();

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        result: rest,
    }
};

const resetPassword = async (payload: { oldPassword: string, newPassword: string }, decodedToken: JwtPayload) => {
    const { oldPassword, newPassword } = payload;

    const isUserExist = await User.findById(decodedToken.userId);
    if (!isUserExist) {
        throw new AppError(statusCode.BAD_REQUEST, 'User not found')
    }

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, isUserExist?.password as string);
    if (!isOldPasswordMatch) {
        throw new AppError(statusCode.NOT_ACCEPTABLE, 'Wrong Password');
    }

    isUserExist.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

    await isUserExist?.save();
};

const getNewAccessToken = async (refreshToken: string) => {

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken: newAccessToken
    }
};

export const AuthService = {
    login,
    resetPassword,
    getNewAccessToken,
}