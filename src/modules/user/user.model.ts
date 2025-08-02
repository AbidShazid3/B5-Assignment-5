import { model, Schema } from "mongoose";
import { IAuthProvider, IProvider, IUser, Role, UserStatus } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
    provider: {
        type: String,
        enum: Object.values(IProvider)
    },
    providerId: { type: String }
}, { _id: false, versionKey: false })

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {type: String},
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        unique: true,
        trim: true,
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(Role),
    },
    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE
    },
    wallet: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
    },
    picture: { type: String },
    address: { type: String },
    auths: [authProviderSchema],

}, { timestamps: true, versionKey: false })


export const User = model<IUser>("User", userSchema)