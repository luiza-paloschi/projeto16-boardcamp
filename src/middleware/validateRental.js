import { db } from "../database/database.js";
import { rentalSchema } from "../schemas/rentalSchema.js";


export async function validateRental(req, res, next){
    const {customerId, gameId, daysRented} = req.body;
    
    try {
        const {error} = rentalSchema.validate({daysRented}, { abortEarly: false })
        if (error) return res.status(400).send(error.details[0].message);

        const customerExists = await db.query('SELECT * FROM customers WHERE id = $1;', [customerId]);
        if (customerExists.rowCount === 0) return res.sendStatus(400);

        const gameExists = await db.query('SELECT * FROM games WHERE id = $1;', [gameId])
        if (gameExists.rowCount === 0) return res.sendStatus(400);

        const rentals = await db.query('SELECT * FROM rentals WHERE "gameId" = $1;', [gameId])
        if (rentals.rowCount >= gameExists.rows[0].stockTotal) return res.sendStatus(400);

        const price = daysRented * gameExists.rows[0].pricePerDay
        
        const date = (new Date()).toISOString().split('T')[0]

        res.locals.rental = {customerId, gameId, rentDate: date, daysRented, returnDate: null, originalPrice: price, delayFee: null}
        next();
    } catch (error) {
        console.log("Erro na validação do rental")
        res.status(500).send(error.message);
    }
}