import { db } from "../database/database.js";

export async function getGames(_, res){

    const games = await db.query("SELECT * FROM games");
    res.send(games.rows);
}

export async function createGame(_, res){
    const game = res.locals.game;

    try {
        await db.query(`INSERT INTO games (name,image,"stockTotal","pricePerDay") VALUES ($1, $2, $3, $4);`,
         [game.name, game.image, game.stockTotal, game.pricePerDay])
        res.sendStatus(201);
    } catch (error) {
        console.log("Erro no cadastro de games");
        res.status(500).send(error.message);
    }
    
}