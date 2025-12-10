import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {

    public async getAllUsers(req: Request, res: Response): Promise<void> {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    }

    public async registerNewUser(req: Request, res: Response): Promise<void> {
        const newUser = await UserService.registerNewUser(req.body);
        res.status(201).json(newUser);
    }

    public async loginUser(req: Request, res: Response): Promise<void> {
        const accessToken = await UserService.loginUser(req.body.username, req.body.password);
        res.status(200).json({ accessToken });
    }

    public async getMe(req: any, res: Response): Promise<void> {
        const user = await UserService.getMe(req.user.username);
        res.status(200).json(user);
    }

    public async editMe(req: any, res: Response): Promise<void> {
        const user = await UserService.editMe(req.user.username, req.body);
        res.status(200).json(user);
    }

    public async getUserById(req: any, res: Response): Promise<void> {
        const user = await UserService.getUserById(req.params.id, req.user.role);
        res.status(200).json(user);
    }
}