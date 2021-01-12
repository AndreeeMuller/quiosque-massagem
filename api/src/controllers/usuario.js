const db = require('../config/database')

exports.create = async (req, res) => {

  // Recebe um array de objetos contendo os usuários para inserção
  const { 
    usuarios
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um insert direto da tabela
  const query = {
    text: '\
      Insert Into\
        usuario (idusuario, nome, usuario, senha, datainclusao, horainclusao, dataalteracao, horaalteracao)\
      Select\
        temp.idusuario as idusuario\
        ,temp.nome as nome\
        ,temp.usuario as usuario\
        ,md5(temp.idusuario||$2||temp.usuario||temp.datainclusao||temp.senha||temp.horainclusao) as senha\
        ,temp.datainclusao as datainclusao\
        ,temp.horainclusao as horainclusao\
        ,temp.dataalteracao as dataalteracao\
        ,temp.horaalteracao as horaalteracao\
      From \
        (\
          Select\
            nextval(' + "'seq_idUsuario'" + ') as idusuario\
            ,(temp.data->>' + "'nome'" + ')::varchar(256) as nome\
            ,(temp.data->>' + "'usuario'" + ')::varchar(128) as usuario\
            ,(temp.data->>' + "'senha'" + ')::varchar(128) as senha\
            ,current_date as datainclusao\
            ,current_time::varchar(10) as horainclusao\
            ,current_date as dataalteracao\
            ,current_time::varchar(10) as horaalteracao\
          From\
            (\
              Select\
                json_array_elements($1::json) as data\
            ) temp\
        ) temp\
      Returning\
        idusuario as "idUsuario"\
    ',
    values: [ JSON.stringify(usuarios), process.env.USER_MD5_SECRET ]
  }

  await db.query(query, (error, response) => {

    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao gravar o(s) usuário(s)!',
        error: error
      })

    } else {

      // Retorna na mesma ordem de criação, os códigos gerados internamente no e-commerce
      res.status(201).send({
        message: 'Usuário(s) gravado(s) com sucesso!',
        body: {
          usuarios: response.rows
        }
      })
    }
  });

}

exports.update = async (req, res) => {

  // Recebe um array de objetos contendo os usuários para atualização
  const { 
    usuarios
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um update direto da tabela
  const query = {
    text: "\
      Update\
        usuario u\
      Set\
        nome = temp.nome\
        ,usuario = temp.usuario\
        ,senha = md5(temp.idusuario||'" + process.env.USER_MD5_SECRET + "'||temp.usuario||u.datainclusao||temp.senha||u.horainclusao)\
        ,dataalteracao = current_date\
        ,horaalteracao = current_time::varchar(10)\
      From\
        (\
          Select\
            (temp.data->>'idUsuario')::integer idusuario\
            ,(temp.data->>'nome')::varchar(256) as nome\
            ,(temp.data->>'usuario')::varchar(128) as usuario\
            ,(temp.data->>'senha')::varchar(128) as senha\
          From\
            (\
              Select\
                json_array_elements($1::json) as data\
            ) temp\
        ) temp\
      Where\
        u.idusuario = temp.idusuario\
    ",
    values: [ JSON.stringify(usuarios) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao atualizar o(s) usuário(s)!',
        error: error
      })

    } else {

    // Retorna mensagem de sucesso.
      res.status(200).send({
        message: 'Usuário(s) atualizado(s) com sucesso!'
      })
    }
  });

}

exports.delete = async (req, res) => {

  // Recebe um array de objetos contendo os usuários para remover
  const { 
    usuarios
  } = req.body

  // Converte o array json para linhas no banco de dados e então realiza um delete direto da tabela
  const query = {
    text: "\
      Delete From\
        usuario u\
      Where\
        u.idusuario in (\
          Select distinct\
            (temp.data->>'idUsuario')::integer as idusuario\
          From\
            (\
              Select\
                json_array_elements($1::json) as data\
            ) temp\
        )\
    ",
    values: [ JSON.stringify(usuarios) ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao remover o(s) usuário(s)!',
        error: error
      })

    } else {

      // Retorna mensagem de sucesso.
      res.status(200).send({
        message: 'Usuário(s) removido(s) com sucesso!'
      })
    }
  });

}