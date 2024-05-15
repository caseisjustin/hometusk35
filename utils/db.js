import pg from "pg"
import dotenv from "dotenv"
dotenv.config()
const { Pool } = pg

const { DB_user, DB_name, DB_psw, DB_port, DB_host } = process.env

const pool = new Pool({
    user: DB_user,
    password: DB_psw,
    host: DB_host,
    port: DB_port,
    database: DB_name
})

export const query = (text, params) => pool.query(text, params)