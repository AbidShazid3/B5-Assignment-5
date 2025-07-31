/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { TransactionType } from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";
import { WalletStatus } from "./wallet.interface";
import { Wallet } from "./wallet.model";
import statusCode from "http-status-codes";

const sendMoney = async (decodedToken: Record<string, any>, receiverPhone: string, amount: number) => {
    const session = await Wallet.startSession();
    session.startTransaction();

    try {
        const senderWallet = await Wallet.findOne({ user: decodedToken.userId }).session(session);
        if (!senderWallet) {
            throw new AppError(statusCode.FORBIDDEN, 'No wallet found')
        }
        if (senderWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(statusCode.FORBIDDEN, 'Your wallet is blocked')
        }

        const receiverUser = await User.findOne({ phone: receiverPhone }).session(session);
        if (!receiverUser) {
            throw new AppError(statusCode.NOT_FOUND, "Receiver not found");
        }

        const receiverWallet = await Wallet.findOne({ user: receiverUser._id }).session(session);
        if (!receiverWallet) {
            throw new AppError(statusCode.FORBIDDEN, 'No wallet found')
        }
        if (receiverWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(statusCode.FORBIDDEN, 'Receiver wallet is blocked')
        }

        const numericAmount = Number(amount);
        if (numericAmount < 50) {
            throw new AppError(statusCode.BAD_REQUEST, 'Minimum send amount is 50')
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

export const WalletService = {
    sendMoney,
}