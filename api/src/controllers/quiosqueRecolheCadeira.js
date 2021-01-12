const db = require('../config/database')

exports.create = async (req, res) => {

  // Recebe um array de objetos contendo os quiosques recolhes cadeiras para inserção
  const { 
    quiosquesRecolhesCadeiras
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um insert direto da tabela
  const query = {
    text: '\
      Insert Into\
        quiosquerecolhecadeira (idquiosquerecolhe, idcadeira, valorcadeira, observacao, valoremperrado)\
      Select\
        (temp.data->>' + "'idQuiosqueRecolhe'" + ')::integer as idquiosquerecolhe\
        ,(temp.data->>' + "'idCadeira'" + ')::integer as idcadeira\
        ,(temp.data->>' + "'valorCadeira'" + ')::decimal(15, 2) as valorcadeira\
        ,(temp.data->>' + "'observacao'" + ')::varchar(1024) as observacao\
        ,(temp.data->>' + "'valorEmperrado'" + ')::decimal(15, 2) as valoremperrado\
      From\
        (\
          Select\
            json_array_elements($1::json) as data\
        ) temp\
      Returning\
        idquiosquerecolhecadeira as "idQuiosqueRecolheCadeira"\
    ',
    values: [ JSON.stringify(quiosquesRecolhesCadeiras) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao gravar o(s) quiosque(s) recolhe(s) cadeira(s)!',
        error: error
      })

    } else {

      // Retorna na mesma ordem de criação, os códigos gerados internamente no e-commerce
      res.status(201).send({
        message: 'Quiosque(s) recolhe(s) cadeira(s) gravado(s) com sucesso!',
        body: {
          quiosquesRecolhesCadeiras: response.rows
        }
      })
    }
  })

}

exports.update = async (req, res) => {

  // Recebe um array de objetos contendo os quiosques recolhes cadeiras para atualização
  const { 
    quiosquesRecolhesCadeiras
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um update direto da tabela
  const query = {
    text: '\
      Update\
        quiosquerecolhecadeira qrc\
      Set\
        idquiosquerecolhe = temp.idquiosquerecolhe,\
        idcadeira = temp.idcadeira,\
        valorcadeira = temp.valorcadeira,\
        observacao = temp.observacao,\
        valoremperrado = temp.valoremperrado,\
      From\
        (\
          Select\
            (temp.data->>' + "'idQuiosqueRecolheCadeira'" + ')::integer as idquiosquerecolhecadeira\
            ,(temp.data->>' + "'idQuiosqueRecolhe'" + ')::integer as idquiosquerecolhe\
            ,(temp.data->>' + "'idCadeira'" + ')::integer as idcadeira\
            ,(temp.data->>' + "'valorCadeira'" + ')::decimal(15, 2) as valorcadeira\
            ,(temp.data->>' + "'observacao'" + ')::varchar(1024) as observacao\
            ,(temp.data->>' + "'valorEmperrado'" + ')::decimal(15, 2) as valoremperrado\
          From\
            (\
              Select\
                json_array_elements($1::json) as data\
            ) temp\
        ) temp\
      Where\
        qrc.idquiosquerecolhecadeira = temp.idquiosquerecolhecadeira\
    ',
    values: [ JSON.stringify(quiosquesRecolhesCadeiras) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao atualizar o(s) quiosque(s) recolhe(s) cadeira(s)!',
        error: error
      })

    } else {

    // Retorna mensagem de sucesso.
      res.status(200).send({
        message: 'Quiosque(s) recolhe(s) cadeira(s) atualizado(s) com sucesso!'
      })
    }
  })

}

exports.delete = async (req, res) => {

  // Recebe um array de objetos contendo os quiosques recolhes cadeiras para remover
  const { 
    quiosquesRecolhesCadeiras
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um delete direto da tabela
  const query = {
    text: "\
      Delete From\
        quiosquerecolhecadeira qrc\
      Where\
        qrc.idquiosquerecolhecadeira in (\
          Select distinct\
            (temp.data->>'idQuiosqueRecolheCadeira')::integer as quiosquerecolhecadeira\
          From\
            (\
              Select\
                json_array_elements($1::json) as data\
            ) temp\
        )\
    ",
    values: [ JSON.stringify(quiosquesRecolhesCadeiras) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao remover o(s) quiosque(s) recolhe(s) cadeira(s)!',
        error: error
      })

    } else {

    // Retorna mensagem de sucesso.
      res.status(200).send({
        message: 'Quiosque(s) recolhe(s) cadeira(s) removido(s) com sucesso!'
      })
    }
  })

}