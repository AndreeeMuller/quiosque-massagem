const db = require('../config/database')

exports.create = async (req, res) => {

  // Recebe um array de objetos contendo as cadeiras para inserção
  const { 
    cadeiras
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um insert direto da tabela
  const query = {
    text: '\
      Insert Into\
        cadeira (identificacao)\
      Select\
        (temp.data->>' + "'identificacao'" + ')::integer as identificacao\
      From\
        (\
          Select\
            json_array_elements($1::json) as data\
        ) temp\
      Returning\
        idcadeira as "idCadeira"\
    ',
    values: [ JSON.stringify(cadeiras) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao gravar a(s) cadeira(s)!',
        error: error
      })

    } else {

      // Retorna na mesma ordem de criação, os códigos gerados internamente no e-commerce
      res.status(201).send({
        message: 'Cadeira(s) gravada(s) com sucesso!',
        body: {
          cadeiras: response.rows
        }
      })
    }
  })

}

exports.update = async (req, res) => {

  // Recebe um array de objetos contendo as cadeiras para atualização
  const { 
    cadeiras
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um update direto da tabela
  const query = {
    text: "\
      Update\
        cadeira c\
      Set\
        identificacao = temp.identificacao\
      From\
        (\
          Select\
            (temp.data->>'idCadeira')::integer as idcadeira\
            ,(temp.data->>'identificacao')::integer as identificacao\
          From\
            (\
              Select\
                json_array_elements($1::json) as data\
            ) temp\
        ) temp\
      Where\
        c.idcadeira = temp.idcadeira\
    ",
    values: [ JSON.stringify(cadeiras) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao atualizar a(s) cadeira(s)!',
        error: error
      })

    } else {

    // Retorna mensagem de sucesso.
      res.status(200).send({
        message: 'Cadeira(s) atualizada(s) com sucesso!'
      })
    }
  })

}

exports.delete = async (req, res) => {

  // Recebe um array de objetos contendo as cadeiras para remover
  const { 
    cadeiras
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um delete direto da tabela
  const query = {
    text: "\
      Delete From\
        cadeira c\
      Where\
        c.idcadeira in (\
          Select distinct\
            (temp.data->>'idCadeira')::integer as idcadeira\
          From\
            (\
              Select\
                json_array_elements($1::json) as data\
            ) temp\
        )\
    ",
    values: [ JSON.stringify(cadeiras) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao remover a(s) cadeira(s)!',
        error: error
      })

    } else {

    // Retorna mensagem de sucesso.
      res.status(200).send({
        message: 'Cadeira(s) removida(s) com sucesso!'
      })
    }
  })

}