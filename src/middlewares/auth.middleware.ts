import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../interfaces/user.interface';
import 'express';

export function signToken(user: User): string {
    return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: '1h' });
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.', code: 401 });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(400).json({ error: 'Invalid authorization header.', code: 400 });
    }

    const token = authHeader.split(" ")[1] || "";

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;
        (req as any).user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.', code: 401 });
    }
};