/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AdminService } from "./admin.service";
import sendResponse from "../../utils/sendResponse";
import statusCode from 'http-status-codes';

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await AdminService.getAllUsers();

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'All User retrieved successfully',
        data: users,
    })
});

const getAllAgents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await AdminService.getAllAgents();

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'All Agent retrieved successfully',
        data: users,
    })
});


const getAllWallets = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.getAllWallets();

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'All Wallet retrieved successfully',
        data: result,
    })
});

const getAllTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await AdminService.getAllTransactions();

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'All Transactions retrieved successfully',
        data: users,
    })
});

const blockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { status } = req.body;
    const result = await AdminService.blockWallet(id, status);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'Wallet status updated successfully',
        data: result?.status,
    })
});

const approveAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { status } = req.body;
    const result = await AdminService.approveAgent(id, status);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'Status updated successfully',
        data: result?.status,
    })
});

export const AdminController = {
    getAllUsers,
    getAllAgents,
    getAllWallets,
    getAllTransactions,
    blockWallet,
    approveAgent,
}