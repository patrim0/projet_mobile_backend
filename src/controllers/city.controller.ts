import { Request, Response } from 'express';
import { CityService } from '../services/city.service';

export class CityController {

    public async getCitiesByCca3(req: any, res: Response): Promise<void> {
        const cities = await CityService.getCitiesByCca3(req.query.cca3);
        res.status(200).json(cities);
    }
}