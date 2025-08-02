import { Types } from "mongoose";


export enum TransactionType {
    SEND = "SEND",
    WITHDRAW = "WITHDRAW",
    TOP_UP = "TOP_UP",
    CASH_IN = "CASH_IN",
    CASH_OUT = "CASH_OUT",
}

export enum TransactionStatus{
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    REVERSED = "REVERSED"
}

export enum Direction {
    SENT = "SENT",
    RECEIVED = "RECEIVED",
}

export interface ITransaction {
    from: Types.ObjectId | null;
    to: Types.ObjectId | null;
    amount: number;
    fee: number;
    type: TransactionType;
    status: TransactionStatus;
    direction?: Direction,
}
