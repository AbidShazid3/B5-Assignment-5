import { Types } from "mongoose";


export enum TransactionType {
    SEND = "SEND",
    CASH_IN = "CASH_IN",
    CASH_OUT = "CASH_OUT",
    TOP_UP = "TOP_UP",
    WITHDRAW = "WITHDRAW"
}

export interface ITransaction {
    from: Types.ObjectId | null;
    to: Types.ObjectId | null;
    amount: number;
    fee: number;
    type: TransactionType;
}
