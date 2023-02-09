import { Router } from 'express'
import { createRental, deleteRental, finishRental, getRentals } from '../controller/rentalController.js';
import { validateFinish, validateRental } from '../middleware/validateRental.js';

const rentalRouter = Router();

rentalRouter.post("/rentals", validateRental, createRental);
rentalRouter.get("/rentals", getRentals);
rentalRouter.post("/rentals/:id/return", validateFinish, finishRental);
rentalRouter.delete("/rentals/:id", deleteRental);

export default rentalRouter;