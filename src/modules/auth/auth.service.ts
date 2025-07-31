import AppError from "../../errorHelpers/AppError"
import { IUser, UserStatus } from "../user/user.interface"
import { User } from "../user/user.model"
import statusCode from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { Wallet } from "../walet/wallet.model";
import { WalletStatus } from "../walet/wallet.interface";
import { createUserToken } from "../../utils/userToken";

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
    const userWallet = await Wallet.findOne({ user: isUserExist._id });
    if (userWallet?.status === WalletStatus.BLOCKED) {
        throw new AppError(statusCode.FORBIDDEN, 'Your wallet is blocked');
    }

    const userToken = createUserToken(isUserExist);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = isUserExist.toObject();

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        rest,
    }
}

export const AuthService = {
    login,
}