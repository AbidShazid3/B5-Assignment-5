import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.interface"
import { User } from "./user.model";
import statusCode from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { envVars } from "../../config/env";
import { Wallet } from "../walet/wallet.model";

const registerUser = async (payload: IUser) => {
    const { phone, password, ...rest } = payload;
    const session = await User.startSession();
    session.startTransaction();

    try {
        const isUserExist = await User.findOne({ phone}).session(session)
        if (isUserExist) {
            throw new AppError(statusCode.BAD_REQUEST, 'Phone Number already exist')
        }
        const hashPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND));
        const user = await User.create([{
            phone,
            password:hashPassword,
            ...rest,
        }], {session})

        await Wallet.create([{user:user[0]._id}], {session})
        await session.commitTransaction()

        return {
            user: user[0]
        }
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

export const UserService = {
    registerUser,
}