import { Request, Response, NextFunction } from 'express';
import { errorLogger } from '../utils/logger';

export function validateUserRegistration(req: Request, res: Response, next: NextFunction): void {
    const validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const validUserName = /^[a-zA-Z][A-Za-z\d_.-]{2,30}$/;               
    const validPwd = /^(?=.{8,})(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*^#&]).*$/;
    
    if (!req.body.email || !req.body.username || !req.body.password) {
        throw { message: "Mandatory fields are missing", statusCode: 400 };
    }

    if (!validEmail.test(req.body.email)) {
        throw { message: "Invalid email format", statusCode: 422};
    }

    if (!validUserName.test(req.body.username)) {
        throw { message: "Invalid username. Must start with a letter and have between 3 and 30 characters. May only contain alphanumericals and . _ -", statusCode: 422 };
    }

    if (!validPwd.test(req.body.password)) {
        throw { message: "Invalid password. Must have a length of 8 characters, at least one uppercase, one number and one special character ( @$!%*^#& )", statusCode: 422 };
    }
    
    next();
}