const db = require('../config/database')
const { format } = require('util')

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const { Storage } = require('@google-cloud/storage')

// Instantiate a storage client
const storage = new Storage()

exports.get = async (req, res) => {

  const {
    type,
    id
  } = req.params

  const details = global.getMidiaDetailsByType(type)

  const query = {
    text: '\
      Select\
        encode(midia.' + details.columnMidia + ', ' + "'base64'" + ') as "midia"\
        ,midia.' + details.columnMidiaExtensao + ' as "midiaMimeType"\
        ,' + "'teste'" + ' as "midiaName"\
        ,substring(midia.' + details.columnMidiaExtensao + ', position(' + "'/'" + ' in midia.' + details.columnMidiaExtensao + ') + 1) as "midiaExtensao"\
      From\
        ' + details.table + ' midia\
      Where\
        midia.' + details.columnId + ' = $1\
    ',
    values: [ id ]
  }

  await db.query(query, (error, response) => {
    if (error) {
      console.error(error)

      // Retorna erro
      res.status(400).send({
        message: 'Erro ao localizar a(s) mídia(s)!',
        error: error
      })

    } else {

      const midia = response.rows[0] || null

      if (typeof midia !== 'undefined' && midia !== null) {

        const file = Buffer.from(midia.midia, 'base64')

        res.setHeader('content-type', midia.midiaMimeType)
        res.setHeader('content-enconding', 'gzip')
        res.setHeader('charset', 'UTF-8')
        res.setHeader('content-disposition', 'inline; filename=' + midia.midiaName + '.' + midia.midiaExtensao)
        res.setHeader('content-length', file.length)
        res.status(200).send(file)
      } else {

        // Não foi possível localizar o usuário, porém retorna que o usuário ou senha está inválido
        res.status(400).send({
          message: 'Não foi possível localizar a(s) mídia(s), verifique os parâmetros!',
        })
      }
    }
  })

}

exports.upload = async (req, res) => {

  const {
    type,
    id
  } = req.params

  const details = global.getMidiaDetailsByType(type)

  const {
    file
  } = req

  const filename = id + '.' + file.originalname

  // A bucket is a container for objects (files).
  const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET)

  if (!file) {
    res.status(400).send('No file uploaded.')
    return
  }

  // Create a new blob in the bucket and upload the file data.
  // file.originalname vai sempre armazenar a extensão do arquivo, levando em conta que serão criados ids para as midias
  const blob = bucket.file(filename)
  const blobStream = blob.createWriteStream()

  blobStream.on('error', err => {    
    res.status(400).send(err)
    return
  })

  blobStream.on('finish', () => {

    // The public URL can be used to directly access the file via HTTP.

    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )

    const query = {
      text: '\
        Update\
          ' + details.table + ' midia\
        Set\
          ' + details.columnMidiaPath + ' = $1\
        Where\
          midia.' + details.columnId + ' = $2\
      ',
      values: [ publicUrl, id ]
    }
  
    db.query(query, (error, response) => {
      if (error) {
        console.error(error)
  
        // Retorna erro
        res.status(400).send({
          message: 'Erro ao atualizar a(s) mídia(s)!',
          error: error
        })
  
      } else {
  
      // Retorna mensagem de sucesso.
        res.status(200).send({
          message: 'Mídia(s) atualizada(s) com sucesso!'
        })
      }
    })
  })

  blobStream.end(req.file.buffer)
}