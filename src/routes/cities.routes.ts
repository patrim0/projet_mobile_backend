import { Router } from 'express';
import { CityController } from '../controllers/city.controller';

const router = Router();
const cityController = new CityController();

router.get('/cities', cityController.getCitiesByCca3);

export default router;