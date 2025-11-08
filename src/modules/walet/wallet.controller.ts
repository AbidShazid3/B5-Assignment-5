/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import statusCode from 'http-status-codes';
import { WalletService } from "./wallet.service";

const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const { receiverPhone, amount, password } = req.body;

    const result = await WalletService.sendMoney(decodedToken, receiverPhone, amount, password)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'Send successfully',
        data: result.message,
    })
});

const withdraw = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const { amount, password } = req.body;

    const result = await WalletService.withdraw(decodedToken, amount, password);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Done successfully",
        data: result.message,
    });
})

const cashOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const { agentPhone, amount, password } = req.body;

    const result = await WalletService.cashOut(decodedToken, agentPhone, amount, password);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'Send successfully',
        data: result.message,
    })
});

const addMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const { amount, password } = req.body;

    const result = await WalletService.addMoney(decodedToken, amount, password);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'Add money successfully done',
        data: result
    })
})

const cashIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const { receiverPhone, amount, password } = req.body;

    const result = await WalletService.cashIn(decodedToken, receiverPhone, amount, password);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'Send successfully',
        data: result.message,
    })
});

const getMyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const result = await WalletService.getMyWallet(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'My wallet retrieved successfully',
        data: result,
    })
});

export const WalletController = {
    sendMoney,
    withdraw,
    cashOut,
    addMoney,
    cashIn,
    getMyWallet,
}