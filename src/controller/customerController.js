import { db } from "../database/database.js";

export async function getCustomers(_, res){

    try {
        const customers = await db.query("SELECT id, name, phone, cpf, TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday FROM customers ORDER BY id ASC;");
        const arrCustomers = customers.rows
        res.send(arrCustomers);
    } catch (error) {
        console.log("Erro ao fazer GET de customers");
        res.status(500).send(error.message);
    }
}

export async function getCustomerById(req, res){
    const { id } = req.params;
    try {
        const customer = await db.query("SELECT id, name, phone, cpf, TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday FROM customers WHERE id = $1;", [id]);
        if (customer.rowCount === 0) return res.status(404).send("Cliente não encontrado.")
        res.send(customer.rows[0]);
    } catch (error) {
        console.log("Erro ao fazer GET de customer por Id");
        res.status(500).send(error.message);
    }
}

export async function createCustomer(_, res){
    const customer = res.locals.customer;
    try {
        await db.query(`INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1, $2, $3, $4);`,
         [customer.name, customer.phone, customer.cpf, customer.birthday])
        res.sendStatus(201);
    } catch (error) {
        console.log("Erro no cadastro de customers");
        res.status(500).send(error.message);
    }
}

export async function updateCustomer(req, res){
    const { id } = req.params;
    const updated = res.locals.customer;
    try {        
        await db.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;`,
         [updated.name, updated.phone, updated.cpf, updated.birthday, id])
        res.sendStatus(200);
    } catch (error) {
        console.log("Erro no update de customers");
        res.status(500).send(error.message);
    }
}
