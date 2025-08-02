import AppError from "../../errorHelpers/AppError";
import { IUser, Role, UserStatus } from "./user.interface"
import { User } from "./user.model";
import statusCode from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { envVars } from "../../config/env";
import { Wallet } from "../walet/wallet.model";

const registerUser = async (payload: IUser) => {
    const { phone, password, role, ...rest } = payload;
    const session = await User.startSession();
    session.startTransaction();

    try {
        if (role === Role.ADMIN) {
            throw new AppError(statusCode.UNAUTHORIZED, "You cannot register as admin")
        }
        const isUserExist = await User.findOne({ phone }).session(session)
        if (isUserExist) {
            throw new AppError(statusCode.BAD_REQUEST, 'Phone Number already exist')
        }
        const hashPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND));
        const status = role === Role.AGENT ? UserStatus.PENDING : UserStatus.ACTIVE
        const user = await User.create([{
            phone,
            password: hashPassword,
            role,
            status,
            ...rest,
        }], { session })

        const initialBalance = role === Role.AGENT ? 200 : 50;
        const wallet = await Wallet.create(
            [{ user: user[0]._id, balance: initialBalance }],
            { session });
        
        user[0].wallet = wallet[0]._id
        await user[0].save();
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