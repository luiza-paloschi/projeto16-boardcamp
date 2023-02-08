import { Router } from 'express'
import { createGame, getGames } from '../controller/gameController.js';
import { validateGame } from '../middleware/validateGame.js';


const gameRouter = Router();

gameRouter.get("/games", getGames);
gameRouter.post("/games", validateGame, createGame);


export default gameRouter;