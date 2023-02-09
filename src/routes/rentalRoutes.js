import { Router } from 'express'
import { createRental, finishRental, getRentals } from '../controller/rentalController.js';
import { validateFinish, validateRental } from '../middleware/validateRental.js';

const rentalRouter = Router();

rentalRouter.post("/rentals", validateRental, createRental);
rentalRouter.get("/rentals", getRentals);
rentalRouter.post("/rentals/:id/return", validateFinish, finishRental);

export default rentalRouter;