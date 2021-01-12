const db = require('../config/database')

exports.getAll = async (req, res) => {

  const query = {
    text: `\
      Select\
        q.idquiosque as "idQuiosque"\
        ,q.descricao as "quiosque"\
        ,coalesce((\
          Select	json_agg(\
                    json_build_object(\
                       'idCadeira', c.idcadeira,\
                      'identificacao', c.identificacao\
                    )\
                    Order by  qc.ordem\
                  )\
          From    quiosquecadeira qc\
                  inner join cadeira c on (c.idcadeira = qc.idcadeira)\
          Where   qc.idquiosque = q.idquiosque\
        ), '[]') as cadeiras\
        ,coalesce((\
          Select  json_agg(\
                    json_build_object(\
                      'idQuiosqueRecolhe', qr2.idquiosquerecolhe,\
                      'dataInicio', qr2.datainicio::varchar,\
                      'dataInicioLabel', to_char(qr2.datainicio, 'dd/MM/yyyy'),\
                      'horaInicio', qr2.horainicio,\
                      'dataFim', qr2.datainicio::varchar,\
                      'dataFimLabel', to_char(qr2.datafim, 'dd/MM/yyyy'),\
                      'horaFim', qr2.horafim\
                    )\
                  )\
          From    quiosquerecolhe qr2\
          Where	  ( /* # Recolhe com pendência # */\
                    /* # Falta comprovante # */\
                    qr2.comprovantemidiapath is null\
                    or not exists ( /* # Não realizou a contagem # */\
                      Select	NULL\
                      From	  quiosquerecolhecadeira qrc3\
                              inner join quiosquerecolhecadeiracontagem qrcc3 on (qrcc3.idquiosquerecolhecadeira = qrc3.idquiosquerecolhecadeira)\
                      Where 	qrc3.idquiosquerecolhe = qr2.idquiosquerecolhe\
                    )\
                  )\
        ), '[]') as recolhes\
      From\
        quiosque q\
    `,
    values: []
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao localizar o(s) quiosque(s) cadeira(s)!',
        error: error
      })

    } else {

      // Retorna os resultados
      res.status(200).send(responseEncode(response.rows))
    }
  })

}

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