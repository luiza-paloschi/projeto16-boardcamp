import { db } from "../database/database.js";

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
        //const rentalsCustomer = await db.query(`SELECT rentals.*, to_char(rentals."rentDate", 'YYYY-MM-DD') as "rentDateFormated",customers.id AS id2, customers.name
        //FROM rentals JOIN customers ON rentals."customerId"=customers.id;`)


        const rentalsCustomer = await db.query(`SELECT rentals.*, to_char(rentals."rentDate", 'YYYY-MM-DD') as "rentDateFormated",
        to_char(rentals."returnDate", 'YYYY-MM-DD') as "returnDateFormated",
        customers.id AS id2, customers.name, games.id AS id3, games.name AS "nameGame"
        FROM rentals 
        INNER JOIN customers ON rentals."customerId"=customers.id
        INNER JOIN games ON rentals."gameId"=games.id
        ;`)

        //const rentalsGame = await db.query(`SELECT to_char(rentals."returnDate", 'YYYY-MM-DD') as "returnDateFormated",games.id AS idGame, games.name
        //FROM rentals JOIN games ON rentals."gameId"=games.id;`)

        const newArr = rentalsCustomer.rows.map( (item) => {
            const object = {id: item.id, customerId: item.customerId, gameId: item.gameId, rentDate: item.rentDateFormated, 
                daysRented: item.daysRented, returnDate: item.returnDateFormated, originalPrice: item.originalPrice, delayFee:item.delayFee, 
                customer:{id: item.id2, name: item.name}, game:{id: item.id3, name: item.nameGame}}
            return object
        })

        res.send(newArr)
    } catch (error) {
        console.log("Erro no get de receitas");
        res.status(500).send(error.message);
    }

}