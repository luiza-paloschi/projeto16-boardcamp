import { db } from "../database/database.js";

import dayjs from "dayjs";

export async function createRental(_, res){
    const rental = res.locals.rental;
    try {
        await db.query(`INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") 
        VALUES ($1, $2, $3, $4, $5, $6, $7);`,
         [rental.customerId, rental.gameId, rental.rentDate, rental.daysRented, rental.returnDate, rental.originalPrice, rental.delayFee])
        res.sendStatus(201);
    } catch (error) {
        console.log("Erro na criação de uma rental");
        res.status(500).send(error.message);
    }
}

export async function getRentals(_, res){
    try {
        
        const rentals = await db.query(`
        SELECT rentals.*, 
               JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer,
               JSON_BUILD_OBJECT('id', games.id, 'name', games.name) AS game
        FROM rentals
        INNER JOIN customers 
            ON rentals."customerId"=customers.id
        INNER JOIN games 
            ON rentals."gameId"=games.id
        ;`);

        res.send(rentals.rows)
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function finishRental(_, res){
   
    try {     
        const rent = res.locals.finish;
        
        rent.returnDate = dayjs().format("YYYY-MM-DD");
        rent.rentDate = dayjs(rent.rentDate);

        const shouldReturn = rent.rentDate.add(rent.daysRented, 'day');
        
        if(shouldReturn.isBefore(rent.returnDate)){
            rent.delayFee = -(shouldReturn.diff(rent.returnDate, 'days') * rent.pricePerDay);
        } 
        else {
            rent.delayFee = null;
        }
            

        await db.query('UPDATE rentals SET "delayFee"=$1, "rentDate"=$2, "returnDate"=$3 WHERE id=$4', 
        [rent.delayFee, rent.rentDate, rent.returnDate, rent.id]);

        res.sendStatus(200);
    }
    catch(error) {
        res.status(505).send(error.message);
    }
}

export async function deleteRental(req, res){
    const {id} = req.params;
    const numberId = Number(id)

    try {
        const rentalExists =  await db.query(
            `SELECT *
            FROM rentals WHERE id = $1;`, [numberId])
        if (rentalExists.rowCount === 0) return res.sendStatus(404);

        const rental = rentalExists.rows[0];
        if (rental.returnDate === null) return res.sendStatus(400)

        await db.query(`DELETE FROM rentals WHERE id = $1;`, [numberId])
        res.sendStatus(200);

    } catch (error) {
        console.log("Erro no delete de um rental");
        res.status(500).send(error.message);
    }
}