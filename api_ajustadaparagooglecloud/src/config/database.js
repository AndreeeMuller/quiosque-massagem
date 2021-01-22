const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config()

const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';

const pool = new Pool({
  user: process.env.DB_USER, // e.g. 'my-db-user'
  password: process.env.DB_PASS, // e.g. 'my-db-password'
  database: process.env.DB_NAME, // e.g. 'my-database'
  // If connecting via unix domain socket, specify the path
  host: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`
})

pool.on('connect', () => {
  console.log('Base de Dados conectado com sucesso!')
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}