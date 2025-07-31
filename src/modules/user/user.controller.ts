/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import statusCode from 'http-status-codes';
import { UserService } from "./user.service";

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await UserService.registerUser(payload);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.CREATED,
        message: 'User created successfully',
        data: user,
    })
})

export const UserController = {
    registerUser,
}