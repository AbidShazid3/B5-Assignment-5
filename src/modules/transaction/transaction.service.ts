import AppError from "../../errorHelpers/AppError";
import { WalletStatus } from "../walet/wallet.interface";
import { Wallet } from "../walet/wallet.model";
import statusCode from "http-status-codes";
import { Transaction } from "./transaction.model";

const getMyTransactions = async (userId: string) => {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new AppError(statusCode.NOT_FOUND, 'Wallet not found')
    }
    if (wallet.status === WalletStatus.BLOCKED) {
        throw new AppError(statusCode.BAD_REQUEST, 'Your wallet is blocked. Contact to support')
    }

    const transactions = await Transaction.find({
        $or: [{ from: wallet._id }, { to: wallet._id }]
    })
        .populate({
            path: 'from',
            select: '-balance -createdAt -updatedAt -status',
            populate: {
                path: 'user',
                select: 'name phone'
            }
        })
        .populate({
            path: 'to',
            select: '-balance -createdAt -updatedAt -status',
            populate: {
                path: 'user',
                select: 'name phone'
            }
        })
        .sort({ createdAt: -1 });

    return transactions;

}

export const TransactionService = {
    getMyTransactions,
}