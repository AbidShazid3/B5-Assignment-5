import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Transaction } from "../transaction/transaction.model";
import { userSearchableFields } from "../user/user.constant";
import { Role, UserStatus } from "../user/user.interface";
import { User } from "../user/user.model";
import { Wallet } from "../walet/wallet.model";
import statusCode from 'http-status-codes';

const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find({ role: Role.USER }), query);
    const allUsers = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .pagination();
    const users = await allUsers.build().populate({
        path: "wallet",
        select: "-__v -createdAt -updatedAt"
    })
        .select("-password");
    const totalUsers = await queryBuilder.getMeta();

    return {
        data: users,
        meta: totalUsers,
    }
};

const getAllAgents = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find({ role: Role.AGENT }), query);
    const allAgent = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .pagination();
    const agents = await allAgent.build().populate({
        path: "wallet",
        select: "-__v -createdAt -updatedAt"
    })
        .select("-password");
    const totalAgents = await queryBuilder.getMeta();

    return {
        data: agents,
        meta: totalAgents,
    }
};

const getAllWallets = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Wallet.find(), query);
    const allWallet = queryBuilder
        .filter()
        .sort()
        .pagination();
    const wallets = await allWallet.build().populate('user', 'name phone role');
    const totalWallets = await queryBuilder.getMeta();

    return {
        data: wallets,
        meta: totalWallets,
    }
};

const getAllTransactions = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Transaction.find(), query);
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
};

const blockWallet = async (id: string, status: string) => {
    const wallet = await Wallet.findById(id);
    if (!wallet) {
        throw new AppError(statusCode.NOT_FOUND, 'Wallet not found');
    }
    if (wallet.status === status) {
        throw new AppError(statusCode.BAD_REQUEST, `Already in ${wallet.status}`);
    }
    const walletStatusUpdate = await Wallet.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

    return walletStatusUpdate
};

const approveAgent = async (id: string, status: UserStatus) => {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, 'User not found');
    }
    if (user.status === status) {
        throw new AppError(statusCode.BAD_REQUEST, `Already in ${user.status}`);
    }
    const userStatusUpdate = await User.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

    return userStatusUpdate;
};



export const AdminService = {
    getAllUsers,
    getAllAgents,
    getAllWallets,
    getAllTransactions,
    blockWallet,
    approveAgent,
}