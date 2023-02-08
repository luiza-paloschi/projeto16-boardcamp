import express from 'express';
import cors from 'cors';
import gameRouter from './routes/gameRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(gameRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('O servidor está rodando'));