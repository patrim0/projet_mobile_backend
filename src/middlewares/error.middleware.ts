import { Request, Response, NextFunction } from 'express';
import { errorLogger } from '../utils/logger';

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction): void {

    let code = Number(err.statusCode) || 500;

    if (err.message === "Document failed validation") {
        code = 400;
    }

    errorLogger.error(`${err.message} | Error ${code} at ${req.method} ${req.url}${err.stack ? ` | Stack: ${err.stack}` : ""}`)
    res.status(code).json({ message: err.message, code: code, details: err.details });
}