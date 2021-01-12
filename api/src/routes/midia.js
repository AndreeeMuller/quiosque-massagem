const router = require('express-promise-router')()
const controller = require('../controllers/midia')
const fs = require('fs')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        // Captura o tipo de midia que vai ser criada
        const {
            type
        } = req.params

        // Busca os detalhes da midia
        const details = global.getMidiaDetailsByType(type)

        // Cria o diretório, caso não exista
        fs.mkdirSync(details.uploadPath, { recursive: true })

        // Define o diretório
        cb(null, details.uploadPath)
    },
    filename: (req, file, cb) => {

        // Captura o id da midia
        const {
            id
        } = req.params

        // file.originalname vai sempre armazenar a extensão do arquivo, levando em conta que serão criados ids para as midias
        cb(null, id + '.' + file.originalname)
    }
})
const upload = multer({ storage })

router.get('/midia/:type/:id', controller.get)

// upload.single('file') captura no formulário o campo 'file' para salvar no diretório
router.post('/midia/:type/:id', global.tokenValidation, upload.single('file'), controller.upload)

module.exports = router