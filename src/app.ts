import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import logsRoutes from './routes/logs.routes';

import { errorMiddleware } from './middlewares/error.middleware';
import { loggerMiddleware } from './middlewares/logs.middleware';

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' 
        : process.env.NODE_ENV === 'production' ? '.env.production'
        : '.env'
});

const app = express();

const mongodbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/';
const origins = process.env.CORS_ORIGINS || 'http://localhost:3000';

mongoose.connect(mongodbUri)
.then(() => console.log(`Connecté à ${mongodbUri}`))
.catch(console.dir);
    
const database = mongoose.connection;

app.use(cors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(rateLimit({ windowMs: 900000, max: 100 }));

app.use(loggerMiddleware);

app.use('/api', authRoutes);
app.use('/api', userRoutes);

app.use('/api', logsRoutes);

app.get('/api/error', (req: Request, res: Response) => {
    throw new Error("Test d'erreur");
})

app.use(errorMiddleware);

export { app, database };