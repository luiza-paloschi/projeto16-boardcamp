
import { customerSchema } from "../schemas/customerSchema.js";

export async function validateCustomer(req, res, next){
    const {name, phone, cpf, birthday} = req.body;
    
    try {
        const {error} = customerSchema.validate({name, phone, cpf, birthday}, { abortEarly: false })

        if (error) return res.status(400).send(error.details[0].message);
    
        res.locals.customer = {name, phone, cpf, birthday};
        next();
    } catch (error) {
        console.log("Erro na validação do customer")
        res.status(500).send(error.message);
    }
}