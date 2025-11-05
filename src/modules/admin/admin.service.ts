import AppError from "../../errorHelpers/AppError";
import { Transaction } from "../transaction/transaction.model";
import { Role, UserStatus } from "../user/user.interface";
import { User } from "../user/user.model";
import { Wallet } from "../walet/wallet.model";
import statusCode from 'http-status-codes';

const getAllUsers = async () => {
    const users = await User.find({ role: Role.USER });

    return users;
};

const getAllAgents = async () => {
    const agents = await User.find({ role: Role.AGENT })

    return agents;
};

const getAllWallets = async () => {
    const wallets = await Wallet.find().populate('user', 'name phone role');

    return wallets
};

const getAllTransactions = async () => {
    const transactions = await Transaction.find()
    return transactions;
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