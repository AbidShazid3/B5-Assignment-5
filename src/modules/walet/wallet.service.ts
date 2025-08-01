/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { TransactionType } from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { WalletStatus } from "./wallet.interface";
import { Wallet } from "./wallet.model";
import statusCode from "http-status-codes";
import bcryptjs from 'bcryptjs';

const sendMoney = async (decodedToken: Record<string, any>, receiverPhone: string, amount: number, password: string) => {
    const session = await Wallet.startSession();
    session.startTransaction();

    try {
        const senderUser = await User.findById(decodedToken.userId).session(session);
        if (!senderUser) {
            throw new AppError(statusCode.NOT_FOUND, 'User not found')
        }
        const passwordMatch = await bcryptjs.compare(password, senderUser.password);
        if (!passwordMatch) {
            throw new AppError(statusCode.UNAUTHORIZED, 'Incorrect password')
        }

        const senderWallet = await Wallet.findOne({ user: decodedToken.userId }).session(session);
        if (!senderWallet || senderWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(statusCode.FORBIDDEN, 'Your wallet is blocked or not found')
        }

        const receiverUser = await User.findOne({ phone: receiverPhone }).session(session);
        if (!receiverUser) {
            throw new AppError(statusCode.NOT_FOUND, "Receiver not found");
        }
        if (receiverUser.role !== Role.USER) {
            throw new AppError(statusCode.BAD_REQUEST, 'You can only send money to a user not agent');
        }

        const receiverWallet = await Wallet.findOne({ user: receiverUser._id }).session(session);
        if (!receiverWallet || receiverWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(statusCode.FORBIDDEN, 'Receiver wallet is blocked or not found')
        }

        const numericAmount = Number(amount);
        if (numericAmount < 20) {
            throw new AppError(statusCode.BAD_REQUEST, 'Minimum send amount is 20')
        }
        const fee = numericAmount > 100 ? 5 : 0;
        const totalDeduction = numericAmount + fee;

        if (senderWallet.balance < totalDeduction) {
            throw new AppError(statusCode.BAD_REQUEST, 'Insufficient balance')
        }
        senderWallet.balance -= totalDeduction;
        receiverWallet.balance += numericAmount;

        await senderWallet.save({ session });
        await receiverWallet.save({ session });

        await Transaction.create([{
            from: senderWallet._id,
            to: receiverWallet._id,
            amount: numericAmount,
            fee,
            type: TransactionType.SEND,
        }], { session })

        await session.commitTransaction()

        return {
            message: `Successfully send ${numericAmount} to ${receiverUser.phone}`
        }
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

const cashOut = async (decodedToken: Record<string, any>, agentPhone: string, amount: number, password: string) => {
    const session = await Wallet.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(decodedToken.userId).session(session)
        if (!user) {
            throw new AppError(statusCode.NOT_FOUND, 'User not found')
        }
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) {
            throw new AppError(statusCode.UNAUTHORIZED, 'Incorrect password')
        }

        const userWallet = await Wallet.findOne({ user: decodedToken.userId }).session(session);
        if (!userWallet || userWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(statusCode.FORBIDDEN, 'Your wallet is blocked or not found')
        }

        const agentUser = await User.findOne({ phone: agentPhone, role: Role.AGENT }).session(session);
        if (!agentUser) {
            throw new AppError(statusCode.NOT_FOUND, "Agent not found");
        }

        const agentWallet = await Wallet.findOne({ user: agentUser._id }).session(session);
        if (!agentWallet || agentWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(statusCode.FORBIDDEN, 'Agent wallet is blocked or not found')
        }

        const numericAmount = Number(amount);
        if (numericAmount < 50) {
            throw new AppError(statusCode.BAD_REQUEST, 'Minimum Withdraw/cash out amount is 50')
        }

        const fee = 5;
        const totalCharge = numericAmount + fee;
        if (userWallet.balance < totalCharge) {
            throw new AppError(statusCode.BAD_REQUEST, 'Insufficient balance')
        }

        userWallet.balance -= totalCharge;
        agentWallet.balance += totalCharge;

        await userWallet.save({ session });
        await agentWallet.save({ session });

        await Transaction.create([{
            from: userWallet._id,
            to: agentWallet._id,
            amount: numericAmount,
            fee,
            type: TransactionType.CASH_OUT,
        }], { session })

        await session.commitTransaction()

        return {
            message: `Withdraw ${amount} via agent ${agentUser.phone} send successful. Charge Fee ${fee}`,
        };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

const cashIn = async (decodedToken: Record<string, any>, receiverPhone: string, amount: number, password: string) => {
    const session = await Wallet.startSession();
    session.startTransaction();

    try {
        const agent = await User.findById(decodedToken.userId).session(session)
        if (!agent) {
            throw new AppError(statusCode.NOT_FOUND, 'User not found')
        }
        const passwordMatch = await bcryptjs.compare(password, agent.password);
        if (!passwordMatch) {
            throw new AppError(statusCode.UNAUTHORIZED, 'Incorrect password')
        }

        const agentWallet = await Wallet.findOne({ user: decodedToken.userId }).session(session);
        if (!agentWallet || agentWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(statusCode.FORBIDDEN, 'Your wallet is blocked or not found')
        }

        const user = await User.findOne({ phone: receiverPhone }).session(session);
        if (!user) {
            throw new AppError(statusCode.NOT_FOUND, "Receiver phone not found");
        }
        if (user.role !== Role.USER) {
            throw new AppError(statusCode.UNAUTHORIZED, "Only cash in to user not agent");
        }

        const userWallet = await Wallet.findOne({ user: user._id }).session(session);
        if (!userWallet || userWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(statusCode.FORBIDDEN, 'Receiver wallet is blocked')
        }

        const numericAmount = Number(amount);
        if (numericAmount < 50) {
            throw new AppError(statusCode.BAD_REQUEST, 'Minimum top-up/cash in amount is 50')
        }

        if (agentWallet.balance < numericAmount) {
            throw new AppError(statusCode.BAD_REQUEST, 'Insufficient balance')
        }

        const fee = 0;
        agentWallet.balance -= numericAmount;
        userWallet.balance += numericAmount;

        await agentWallet.save({ session });
        await userWallet.save({ session });

        await Transaction.create([{
            from: agentWallet._id,
            to: userWallet._id,
            amount: numericAmount,
            fee,
            type: TransactionType.CASH_IN,
        }], { session })

        await session.commitTransaction()

        return {
            message: `Amount ${amount} successfully added to ${user.phone} via Cash In.`,
        };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

export const WalletService = {
    sendMoney,
    cashOut,
    cashIn,
}