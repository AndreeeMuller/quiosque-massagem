const db = require('../config/database')

exports.getAll = async (req, res) => {

  const query = {
    text: '\
      Select\
        q.idquiosque as "idQuiosque"\
        ,q.descricao as "quiosque"\
        ,coalesce((\
          Select	json_agg(\
                    json_build_object(\
                       ' + "'idCadeira'" + ', c.idcadeira,\
                      ' + "'identificacao'" + ', c.identificacao\
                    )\
                    Order by  qc.ordem\
                  )\
          From    quiosquecadeira qc\
                  inner join cadeira c on (c.idcadeira = qc.idcadeira)\
          Where   qc.idquiosque = q.idquiosque\
        ), ' + "'[]'" + ') as cadeiras\
      From\
        quiosque q\
    ',
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

  // Recebe um array de objetos contendo os quiosques cadeiras para inserção
  const { 
    quiosquesCadeiras
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um insert direto da tabela
  const query = {
    text: '\
      Insert Into\
        quiosquecadeira (idquiosque, idcadeira, ordem)\
      Select\
        temp.idquiosque as idquiosque\
        ,temp.idcadeira as idcadeira\
        ,temp.ordem as ordem\
      From\
        (\
          Select\
            (temp.data->>' + "'idQuiosque'" + ')::integer as idquiosque\
            ,(temp.data->>' + "'idCadeira'" + ')::integer as idcadeira\
            ,(temp.data->>' + "'ordem'" + ')::integer as ordem\
          From\
            (\
              Select\
                json_array_elements($1::json) as data\
            ) temp\
        ) temp\
      Where\
        not exists (\
          Select  NULL\
          From    quiosquecadeira qc\
          Where   qc.idquiosque = temp.idquiosque\
                  and qc.idcadeira = temp.idcadeira\
        )\
      Returning\
        idquiosquecadeira as "idQuiosqueCadeira"\
    ',
    values: [ JSON.stringify(quiosquesCadeiras) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao gravar o(s) quiosque(s) cadeira(s)!',
        error: error
      })

    } else {

      // Retorna na mesma ordem de criação, os códigos gerados internamente no e-commerce
      res.status(201).send({
        message: 'Quiosque(s) cadeira(s) gravado(s) com sucesso!',
        body: {
          quiosquesCadeiras: response.rows
        }
      })
    }
  });

}

exports.delete = async (req, res) => {

  // Recebe um array de objetos contendo os quiosques cadeiras para remover
  const { 
    quiosquesCadeiras
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um delete direto da tabela
  const query = {
    text: "\
      Delete From\
        quiosquecadeira qc\
      Where\
        (\
          qc.idquiosque\
          ||'.'||qc.idcadeira\
        ) in (\
          Select distinct\
            (\
              (temp.data->>'idQuiosque')::integer\
              ||'.'||(temp.data->>'idCadeira')::integer\
            ) as idquiosquecadeira\
          From\
            (\
              Select\
                json_array_elements($1::json) as data\
            ) temp\
        )\
    ",
    values: [ JSON.stringify(quiosquesCadeiras) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao remover o(s) quiosque(s) cadeira(s)!',
        error: error
      })

    } else {

    // Retorna mensagem de sucesso.
      res.status(200).send({
        message: 'Quiosque(s) cadeira(s) removido(s) com sucesso!'
      })
    }
  });

}