const mysql = require("promise-mysql");
const dotenv = require("dotenv");
dotenv.config();

const connect = mysql.createConnection({
    host:process.env.host,
    database:process.env.database,
    user:process.env.user,
    password:process.env.password
})

const getConnection = async () => await connect; // Es una conexion asincrona que espera ser llamada

module.exports = {
    getConnection
};
