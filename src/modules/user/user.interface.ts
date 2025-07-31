import { Types } from "mongoose";

export enum Role {
    USER = 'USER',
    AGENT = 'AGENT',
    ADMIN = 'ADMIN',
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED',
}

export enum IProvider {
    GOOGLE = 'google',
    CREDENTIALS = 'credentials'
}

export interface IAuthProvider {
    provider: IProvider;
    providerId: string;
}

export interface IUser {
    _id?: Types.ObjectId,
    name: string,
    email?: string,
    phone: string,
    password: string,
    role: Role,
    isApproved?: boolean,
    status?: UserStatus,
    wallet: Types.ObjectId,
    picture?: string,
    address?: string,
    auths?: IAuthProvider[],
}