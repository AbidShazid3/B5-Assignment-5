/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { AuthService } from "./auth.service"
import sendResponse from "../../utils/sendResponse";
import statusCode from 'http-status-codes';
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.login(req.body);
    setAuthCookie(res, loginInfo);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'User logged in successfully',
        data: loginInfo,
    })
});

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'User logged out successfully',
        data: null,
    })
});

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user
    await AuthService.resetPassword(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'Password reset successfully',
        data: null,
    })
});

const getNewAccessTokenFromRefreshToken = catchAsync(async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(401, "No refresh token found.");
    };

    const tokenInfo = await AuthService.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'New token retrieved successfully',
        data: tokenInfo,
    })
})

export const AuthController = {
    login,
    logout,
    resetPassword,
    getNewAccessTokenFromRefreshToken,
}