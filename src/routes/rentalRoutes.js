import { Router } from 'express'
import { createRental, getRentals } from '../controller/rentalController.js';
import { validateRental } from '../middleware/validateRental.js';

const rentalRouter = Router();

rentalRouter.post("/rentals", validateRental, createRental);
rentalRouter.get("/rentals", getRentals);

export default rentalRouter;