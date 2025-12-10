import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

export class LogsController {

    public async getLastAction(req: Request, res: Response, next: NextFunction): Promise<void> {
        const log = await fs.promises.readFile("./logs/info.log", "utf-8");
        
        const cleanLog = log.trim().split('\n');
        const lastAction = cleanLog[cleanLog.length -2];

        console.log(lastAction);
        res.json(JSON.parse(lastAction));
    }
}