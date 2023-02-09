import express from 'express';
import cors from 'cors';
import gameRouter from './routes/gameRoutes.js';
import customerRouter from './routes/customerRoutes.js';
import rentalRouter from './routes/rentalRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use([gameRouter, customerRouter, rentalRouter]);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('O servidor está rodando'));