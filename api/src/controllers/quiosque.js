const db = require('../config/database')

exports.create = async (req, res) => {

  // Recebe um array de objetos contendo os quiosques para inserção
  const { 
    quiosques
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um insert direto da tabela
  const query = {
    text: '\
      Insert Into\
        quiosque (descricao)\
      Select\
        (temp.data->>' + "'descricao'" + ')::varchar(256) as descricao\
      From\
        (\
          Select\
            json_array_elements($1::json) as data\
        ) temp\
      Returning\
        idquiosque as "idQuiosque"\
    ',
    values: [ JSON.stringify(quiosques) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao gravar o(s) quiosque(s)!',
        error: error
      })

    } else {

      // Retorna na mesma ordem de criação, os códigos gerados internamente no e-commerce
      res.status(201).send({
        message: 'Quiosque(s) gravado(s) com sucesso!',
        body: {
          quiosques: response.rows
        }
      })
    }
  })

}

exports.update = async (req, res) => {

  // Recebe um array de objetos contendo os quiosques para atualização
  const { 
    quiosques
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um update direto da tabela
  const query = {
    text: "\
      Update\
        quiosque q\
      Set\
        descricao = temp.descricao\
      From\
        (\
          Select\
            (temp.data->>'idQuiosque')::integer as idquiosque\
            ,(temp.data->>'descricao')::varchar(256) as descricao\
          From\
            (\
              Select\
                json_array_elements($1::json) as data\
            ) temp\
        ) temp\
      Where\
        q.idquiosque = temp.idquiosque\
    ",
    values: [ JSON.stringify(quiosques) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao atualizar o(s) quiosque(s)!',
        error: error
      })

    } else {

    // Retorna mensagem de sucesso.
      res.status(200).send({
        message: 'Quiosque(s) atualizado(s) com sucesso!'
      })
    }
  })

}

exports.delete = async (req, res) => {

  // Recebe um array de objetos contendo os quiosques para remover
  const { 
    quiosques
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um delete direto da tabela
  const query = {
    text: "\
      Delete From\
        quiosque q\
      Where\
        q.idquiosque in (\
          Select distinct\
            (temp.data->>'idQuiosque')::integer as idquiosque\
          From\
            (\
              Select\
                json_array_elements($1::json) as data\
            ) temp\
        )\
    ",
    values: [ JSON.stringify(quiosques) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao remover o(s) quiosque(s)!',
        error: error
      })

    } else {

    // Retorna mensagem de sucesso.
      res.status(200).send({
        message: 'Quiosque(s) removido(s) com sucesso!'
      })
    }
  })

}