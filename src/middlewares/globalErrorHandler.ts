/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";


export const globalErrorHandler = async(error: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(error);
    }
    const errorSources: any = [];
    let statusCode = 500;
    let message = 'Something went wrong'

    if (error.code === 11000) {
        const matchArray = error.message.match(/"([^"]*)"/)
        statusCode = 400;
        message = `${matchArray[1]} already exist`
    } else if (error.name === "CastError") {
        statusCode = 400;
        message = 'Invalid mongoDB object id. pls provide a valid id';
    } else if (error.name === "ZodError") {
        statusCode = 400;
        message = 'Zod error occurred'
        error.issues.forEach((issue: any) => {
            errorSources.push({
                path: issue.path[issue.path.length - 1],
                message: issue.message
            })
        })
    } else if (error.name === "ValidationError") {
        const errors = Object.values(error.errors);
        errors.forEach((errorObject: any) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }))
        statusCode = 400;
        message = 'Validation error occurred'
    } else if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message
    } else if (error instanceof Error) {
        statusCode = 500;
        message = error.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: envVars.NODE_ENV === 'development' ? error : null,
        stack: envVars.NODE_ENV === 'development' ? error.stack : null
    })
}