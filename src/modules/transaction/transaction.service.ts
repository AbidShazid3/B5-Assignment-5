import AppError from "../../errorHelpers/AppError";
import { WalletStatus } from "../walet/wallet.interface";
import { Wallet } from "../walet/wallet.model";
import statusCode from "http-status-codes";
import { Transaction } from "./transaction.model";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getMyTransactions = async (userId: string, query: Record<string, string>) => {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new AppError(statusCode.NOT_FOUND, 'Wallet not found')
    }
    if (wallet.status === WalletStatus.BLOCKED) {
        throw new AppError(statusCode.BAD_REQUEST, 'Your wallet is blocked. Contact to support')
    }

    const baseQuery = Transaction.find({
        $or: [{ from: wallet._id }, { to: wallet._id }],
    });

    const queryBuilder = new QueryBuilder(baseQuery, query);
    const allTransaction = queryBuilder
        .filter()
        .sort()
        .fields()
        .pagination();

    const transaction = await allTransaction.build()
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

    const totalTransaction = await queryBuilder.getMeta();
    return {
        data: transaction,
        meta: totalTransaction
    };

}

export const TransactionService = {
    getMyTransactions,
}