/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { AuthService } from "./auth.service"
import sendResponse from "../../utils/sendResponse";
import statusCode from 'http-status-codes';
import { setAuthCookie } from "../../utils/setCookie";

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.login(req.body);
    setAuthCookie(res, loginInfo);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'User logged in successfully',
        data: loginInfo,
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
     res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'User logged out successfully',
        data: null,
    })
})

export const AuthController = {
    login,
    logout,
}