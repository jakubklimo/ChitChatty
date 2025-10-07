import { AppError } from "./errors";

export const getStatusCode = (error: any): number => {
    if (error instanceof AppError) return error.statusCode;
    if (error.statusCode) return error.statusCode;
    return 500;
}

export const toHttpError = (error: any, includeStack = false) => {
    if (error instanceof AppError) {
        return {
            success: false,
            error: error.message,
            code: error.code,
            details: error.details,
            ...(includeStack && { stack: error.stack }),
        };
    }

    return {
        seccess: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        ...(includeStack && { stack: error.stack }),
    };
};