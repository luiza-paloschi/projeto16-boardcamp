import { db } from "../database/database.js";
import { rentalSchema } from "../schemas/rentalSchema.js";
import dayjs from "dayjs";


export async function validateRental(req, res, next){
    const {customerId, gameId, daysRented} = req.body;
    
    try {
        const {error} = rentalSchema.validate({customerId, gameId, daysRented}, { abortEarly: false })
        if (error) return res.status(400).send(error.details[0].message);

        const customerExists = await db.query('SELECT * FROM customers WHERE id = $1;', [customerId]);
        if (customerExists.rowCount === 0) return res.sendStatus(400);

        const gameExists = await db.query('SELECT * FROM games WHERE id = $1;', [gameId])
        if (gameExists.rowCount === 0) return res.sendStatus(400);

        const rentals = await db.query('SELECT * FROM rentals WHERE "gameId" = $1;', [gameId])
        if (rentals.rowCount >= gameExists.rows[0].stockTotal) return res.sendStatus(400);

        const price = daysRented * gameExists.rows[0].pricePerDay
        
        const date = dayjs().format('YYYY-MM-DD')

        res.locals.rental = {customerId, gameId, rentDate: date, daysRented, returnDate: null, originalPrice: price, delayFee: null}
        next();
    } catch (error) {
        console.log("Erro na validação do rental")
        res.status(500).send(error.message);
    }
}

export async function validateFinish(req, res, next){
    const { id } = req.params;
    const numberId = Number(id)
    try {
        const rentalExists = await db.query(`SELECT rentals.*, games."pricePerDay" 
         FROM rentals JOIN games ON rentals.id=$1 AND games.id = rentals."gameId"`, [numberId]);
        
        if(rentalExists.rowCount === 0) return res.sendStatus(404);
        
        if(rentalExists.rows[0].returnDate) return res.sendStatus(400);

        res.locals.finish = rentalExists.rows[0];
        
        next();
    }
    catch(error) {
        res.status(500).send(error.message);
    }
}