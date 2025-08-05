import AppError from "../../errorHelpers/AppError";
import { Transaction } from "../transaction/transaction.model";
import { Role } from "../user/user.interface";
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

const approveAgent = async (id: string, status: string) => {
    const agent = await User.findById(id);
    if (!agent) {
        throw new AppError(statusCode.NOT_FOUND, 'Agent not found');
    }
    if (agent.status === status) {
        throw new AppError(statusCode.BAD_REQUEST, `Already in ${agent.status}`);
    }
    const agentStatusUpdate = await User.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

    return agentStatusUpdate;
};



export const AdminService = {
    getAllUsers,
    getAllAgents,
    getAllWallets,
    getAllTransactions,
    blockWallet,
    approveAgent,
}