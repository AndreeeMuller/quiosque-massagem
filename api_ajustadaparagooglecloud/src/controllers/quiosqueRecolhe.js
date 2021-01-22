const db = require('../config/database')

exports.getByIdQuiosqueRecolhe = async (req, res) => {

  const { 
    idQuiosqueRecolhe
  } = req.params

  const query = {
    text: '\
      Select\
        qr.idquiosquerecolhe as "idQuiosqueRecolhe"\
        ,qr.idquiosque as "idQuiosque"\
        ,q.descricao as "quiosque"\
        ,qr.datainicio::varchar as "dataInicio"\
        ,to_char(qr.datainicio, ' + "'dd/MM/yyyy'" + ') as "dataInicioLabel"\
        ,qr.horainicio as "horaInicio"\
        ,qr.datafim::varchar as "dataFim"\
        ,to_char(qr.datafim, ' + "'dd/MM/yyyy'" + ') as "dataFimLabel"\
        ,qr.horafim as "horaFim"\
        ,coalesce(qr.observacao, ' + "''" + ') as "observacao"\
        ,qr.comprovantemidiapath as "comprovanteMidiaPath"\
        ,coalesce((\
          Select	json_agg(\
                    json_build_object(\
                       ' + "'idQuiosqueRecolheCadeira'" + ', coalesce(qrc.idquiosquerecolhecadeira, null),\
                       ' + "'idCadeira'" + ', c.idcadeira,\
                       ' + "'identificacao'" + ', c.identificacao,\
                       ' + "'valorCadeira'" + ', coalesce(qrc.valorcadeira, null),\
                       ' + "'valorEmperrado'" + ', coalesce(qrc.valoremperrado, null),\
                       ' + "'valorCadeiraMidiaPath'" + ', coalesce(qrc.valorcadeiramidiapath, null),\
                       ' + "'observacao'" + ', coalesce(qrc.observacao, ' + "''" + ')\
                    )\
                    Order by  qc.ordem\
                  )\
          From    quiosquecadeira qc\
                  inner join cadeira c on (c.idcadeira = qc.idcadeira)\
                  left join quiosquerecolhecadeira qrc on (qrc.idcadeira = c.idcadeira and qrc.idquiosquerecolhe = qr.idquiosquerecolhe)\
          Where   qc.idquiosque = q.idquiosque\
        ), ' + "'[]'" + ') as cadeiras\
      From\
        quiosquerecolhe qr\
        inner join quiosque q on (q.idquiosque = qr.idquiosque)\
      Where\
        qr.idquiosquerecolhe = $1\
    ',
    values: [ idQuiosqueRecolhe ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao localizar o(s) Quiosque Recolhe(s)!',
        error: error
      })

    } else {

      // Retorna os resultados
      res.status(200).send(response.rowCount > 0 ? responseEncode(response.rows[0]) : null)
    }
  })

}

exports.create = async (req, res) => {

  // Recebe o quiosque que vai iniciar o recolhe
  const {
    idQuiosque
  } = req.params

  // Define o insert
  const query = {
    text: '\
      Insert Into\
        quiosquerecolhe (idquiosque, datainicio, horainicio)\
      Values\
        ($1, current_date, current_time::varchar(8))\
      Returning\
        idquiosquerecolhe as "idQuiosqueRecolhe"\
    ',
    values: [ idQuiosque ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao gravar o(s) Quiosque(s) Recolhe(s)!',
        error: error
      })

    } else {

      // Retorna na mesma ordem de criação, os códigos gerados internamente no e-commerce
      res.status(201).send({
        message: 'Quiosque(s) Recolhe(s) gravado(s) com sucesso!',
        body: {
          idQuiosqueRecolhe: response.rowCount > 0 ? response.rows[0].idQuiosqueRecolhe: null
        }
      })
    }
  });

}

exports.update = async (req, res) => {

  // Recebe os parâmetros
  const model = req.body

  // Atualiza os dados de quiosqueRecolhe
  const query = {
    text: "\
      Update\
        quiosquerecolhe qr\
      Set\
        datafim = coalesce(datafim, current_date),\
        horafim = coalesce(horafim, current_time::varchar(8)),\
        observacao = $2::varchar(1024)\
      Where\
        qr.idquiosquerecolhe = $1\
    ",
    values: [ model.idQuiosqueRecolhe, model.observacao ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao atualizar o(s) Quiosque(s) Recolhe(s)!',
        error: error
      })

    } else {

    // Retorna mensagem de sucesso.
      res.status(200).send({
        message: 'Quiosque(s) Recolhe(s) atualizado(s) com sucesso!'
      })
    }
  })

}
