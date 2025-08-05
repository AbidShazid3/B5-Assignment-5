/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionService } from "./transaction.service";
import sendResponse from "../../utils/sendResponse";
import statusCode from "http-status-codes";

const getMyTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const result = await TransactionService.getMyTransactions(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'My transaction retrieved successfully',
        data: result,
    })
});

export const TransactionController = {
    getMyTransactions,
}