import { Response } from "express";
import { envVars } from "../config/env";

export interface IAuthToken {
    accessToken?: string;
    refreshToken?: string
}

export const setAuthCookie = (res: Response, tokenInfo: IAuthToken) => {
    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            sameSite: "none"
        })
    }
    if(tokenInfo.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            sameSite: "none"
        })
    }
}