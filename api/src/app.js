const express = require('express')
const crypto = require('crypto-js')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')

global.getMidiaDetailsByType = (type) => {
  const details = {}
  switch (type) {
    case 'QUIOSQUE_RECOLHE_CADEIRA': {
      details.table = 'quiosquerecolhecadeira'
      details.columnId = 'idquiosquerecolhecadeira'
      details.columnMidiaPath = 'valorcadeiramidiapath'
      details.uploadPath = 'uploads/midia/quiosque/recolhe/cadeira/'
      break;
    }
  }

  return details
}

// Realiza o encode do response com a chave do cliente
global.responseEncode = function(response) {
    return crypto.AES.encrypt(JSON.stringify(response), process.env.RESPONSE_ENCODE_KEY).toString();
}

// Formato do token
// Authorization: Bearer <acess_token>
// Verifica o token
global.tokenValidation = function(req, res, next) {

    // Pega o valor de autenticação dentro do header
    const bearerHeader = req.headers['authorization']

    // Verifica se foi envia a autenticação
    if (typeof bearerHeader !== 'undefined') {

        // Separa o token entre "Bearer" e "<acess_token>
        const bearer = bearerHeader.split(' ')

        // Pega o token
        const bearerToken = bearer[1]

        // Define o token
        req.token = bearerToken

        jwt.verify(req.token, process.env.JWT_SECRET, (error, response) =>{
            if (error) {
                res.sendStatus(403)
            } else {
                next()
            }
        })
    } else {

        // Necessário autenticar
        res.sendStatus(401)
    }
}

// Define as URLs que tem acesso à api
var corsOptions = {
  origin: function (origin, callback) {
    if (process.env.CORS_URLS_LIST.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Origem não permitida pelo CORS!'))
    }
  }
}

// middlewares (Executa antes da rota)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))

// routes
const rUsuario = require('./routes/usuario')
const rAuth = require('./routes/auth')
const rMidia = require('./routes/midia')
const rQuiosque = require('./routes/quiosque')
const rCadeira = require('./routes/cadeira')
const rQuiosqueCadeira = require('./routes/quiosqueCadeira')
const rQuiosqueRecolhe = require('./routes/quiosqueRecolhe')
const rQuiosqueRecolheCadeira = require('./routes/quiosqueRecolheCadeira')

app.use('/api/v1/', rUsuario)
app.use('/api/v1/', rAuth)
app.use('/api/v1/', rMidia)
app.use('/api/v1/', rQuiosque)
app.use('/api/v1/', rCadeira)
app.use('/api/v1/', rQuiosqueCadeira)
app.use('/api/v1/', rQuiosqueRecolhe)
app.use('/api/v1/', rQuiosqueRecolheCadeira)

module.exports = app;