const db = require('../config/database')
const jwt = require('jsonwebtoken')

exports.create = async (req, res) => {

  // Recebe um objeto com dados de acesso ao sistema
  const { 
    usuario,
    senha
  } = req.body

  // Verifica se o usuário existe no sistema
  const query = {
    text: "\
      Select\
        u.idusuario as idusuario\
        ,u.usuario as usuario\
        ,u.datainclusao as datainclusao\
        ,u.horainclusao as horainclusao\
        ,u.senha as senhabanco\
        ,md5(u.idusuario||$3||u.usuario||u.datainclusao||$2||u.horainclusao) as senhausuario\
      From\
        usuario u\
      Where\
        upper(trim(u.usuario)) = upper(trim($1))\
    ",
    values: [ usuario, senha, process.env.USER_MD5_SECRET ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Não foi possível realizar login, tente novamente mais tarde!'
      })

    } else {

      const usuarioBanco = response.rows[0] || null

      if (typeof usuarioBanco !== 'undefined' && usuarioBanco !== null) {

        if (usuarioBanco.senhabanco === usuarioBanco.senhausuario) {

          // Login realizado com sucesso
          const user = {
            idUsuario: usuarioBanco.idusuario,
            usuario: usuarioBanco.usuario
          }
          jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }, (error, response) => {
            res.status(200).send({
              message: 'Usuário autenticado com sucesso!',
              token: response
            })
          })

        } else {

          // Não foi possível localizar o usuário, porém retorna que o usuário ou senha está inválido
          res.status(400).send({
            message: 'Usuário e/ou senha inválido!',
          })

        }

      } else {

        // Não foi possível localizar o usuário, porém retorna que o usuário ou senha está inválido
        res.status(400).send({
          message: 'Usuário e/ou senha inválido!',
        })
      }
    }
  });

}