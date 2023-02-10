import { db } from "../database/database.js";
import { idSchema } from "../schemas/idSchema.js";
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
        
        const date = (new Date()).toISOString().split('T')[0]

        res.locals.rental = {customerId, gameId, rentDate: date, daysRented, returnDate: null, originalPrice: price, delayFee: null}
        next();
    } catch (error) {
        console.log("Erro na validação do rental")
        res.status(500).send(error.message);
    }
}

export async function validateFinish(req, res, next){
    /*const {id} = req.params;
    const numberId = Number(id)
    try {
        const {error} = idSchema.validate({numberId}, { abortEarly: false })
        if (error) return res.sendStatus(401);
        

        const rentalExists =  await db.query(
            `SELECT id, "customerId", "gameId", TO_CHAR("rentDate", 'YYYY-MM-DD') AS "rentDate", "daysRented", TO_CHAR("returnDate", 'YYYY-MM-DD')
             AS "returnDate", "originalPrice", "delayFee"
            FROM rentals WHERE id = $1;`, [numberId])

        const rentalExists =  await db.query(
            `SELECT *
            FROM rentals WHERE id = $1;`, [numberId])
        if (rentalExists.rowCount === 0) return res.sendStatus(404);
        
        let rental = rentalExists.rows[0]

        if (rental.returnDate !== null) return res.sendStatus(400);

        let todayDate = new Date();
        let rentDate = new Date(rental.rentDate);

        let difference = todayDate.getTime() - rentDate.getTime();
        let totalDays = Math.ceil(difference / (1000 * 3600 * 24));

        if (totalDays > rental.daysRented){
            console.log("Entrou aqui")
            let lateDays = totalDays - rental.daysRented
            let pricePerDay = Math.ceil(rental.originalPrice / rental.daysRented)
            rental = {...rental, delayFee: parseInt(pricePerDay * lateDays)}
        }
        rental = {...rental, returnDate: todayDate.toISOString().split('T')[0]}

        res.locals.finish = rental
        next();
        
    } catch (error) {
        console.log("Erro na validação da finalização do rental")
        res.status(504).send(error.message);
    } */

    try {
             
        const { id } = req.params;
        const numberId = Number(id)
        const rent = await db.query(`SELECT rentals.*, games."pricePerDay" 
                                            FROM rentals JOIN games ON rentals.id=$1 AND games.id = rentals."gameId"`, [numberId]);
        
        if(!rent.rows.length)
            return res.status(404).send("Aluguel não encontrado")
        
        if(rent.rows[0].returnDate)
            return res.status(400).send("Aluguel já finalizado")

        res.locals.rent = rent.rows[0];
        
        next();
    }
    catch(e) {
        console.log(e)
        res.status(504).send(e);
    }
}