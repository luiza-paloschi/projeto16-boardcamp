import { db } from "../database/database.js";
import { gameSchema } from "../schemas/gameSchema.js";

export async function validateGame(req, res, next){
    const {name, image, stockTotal, pricePerDay} = req.body;

    try {
        const {error} = gameSchema.validate({name, image, stockTotal, pricePerDay}, { abortEarly: false })

        if (error) return res.status(400).send(error.details[0].message);
        const gameExists = await db.query('SELECT * FROM games WHERE name = $1;', [name]);
       
        if (gameExists.rowCount !== 0) return res.status(409).send("Este jogo já existe!");
    
        res.locals.game = {name, image, stockTotal, pricePerDay};
        next();
    } catch (error) {
        console.log("Erro na validação do game")
        res.status(500).send(error.message);
    }
}