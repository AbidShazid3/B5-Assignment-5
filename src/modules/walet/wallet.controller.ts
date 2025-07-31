/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import statusCode from 'http-status-codes';
import { WalletService } from "./wallet.service";

const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const { receiverPhone, amount } = req.body;
    
    const result = await WalletService.sendMoney(decodedToken, receiverPhone, amount)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'Send successfully',
        data: result.message,
    })
})

export const WalletController = {
    sendMoney,
}