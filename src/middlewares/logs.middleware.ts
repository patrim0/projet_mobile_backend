import { Request, Response, NextFunction } from "express";
import { infoLogger } from "../utils/logger";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
    infoLogger.info(`${req.method} ${req.url}`);
    next();
}