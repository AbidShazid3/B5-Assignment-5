/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionService } from "./transaction.service";
import sendResponse from "../../utils/sendResponse";
import statusCode from "http-status-codes";

const getMyTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const query = req.query;
    const result = await TransactionService.getMyTransactions(decodedToken.userId, query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'My transaction retrieved successfully',
        data: result.data,
        meta: result.meta,
    })
});

export const TransactionController = {
    getMyTransactions,
}