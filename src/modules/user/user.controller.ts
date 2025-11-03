/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import statusCode from 'http-status-codes';
import { UserService } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

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

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const user = await UserService.getMe(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'User data retrieved successfully',
        data: user,
    })
})

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await UserService.getSingleUser(id);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'User retrieved successfully',
        data: user,
    })
});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserService.updateUser(req.body, decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'User updated successfully',
        data: result,
    })
});

export const UserController = {
    registerUser,
    getMe,
    getSingleUser,
    updateUser,
}