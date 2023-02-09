import joi from "joi";

export const rentalSchema= joi.object({
    daysRented: joi.number().positive().required()
  });