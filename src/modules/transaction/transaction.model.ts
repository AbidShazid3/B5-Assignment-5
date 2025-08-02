import { model, Schema } from "mongoose";
import { Direction, ITransaction, TransactionStatus, TransactionType } from "./transaction.interface";


const transactionSchema = new Schema<ITransaction>({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        default: null,
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        default: null,
    },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    type: {
        type: String,
        enum: Object.values(TransactionType),
        required: true
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.COMPLETED
    },
    direction: {
        type: String,
        enum: Object.values(Direction),
        required: false,
    }
}, { timestamps: true, versionKey: false });

export const Transaction = model<ITransaction>("Transaction", transactionSchema);