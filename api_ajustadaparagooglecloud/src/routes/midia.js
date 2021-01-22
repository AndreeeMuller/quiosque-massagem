const router = require('express-promise-router')()
const controller = require('../controllers/midia')
const Multer = require('multer')
const storage = Multer.diskStorage({
    filename: (req, file, cb) => {

        // Captura o id da midia
        const {
            id
        } = req.params

        // file.originalname vai sempre armazenar a extensão do arquivo, levando em conta que serão criados ids para as midias
        cb(null, id + '.' + file.originalname)
    }
})
// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({ storage })

// Process the file upload and upload to Google Cloud Storage.
// upload.single('file') captura no formulário o campo 'file' para salvar no diretório
router.post('/midia/:type/:id', global.tokenValidation, multer.single('file'), controller.upload)
router.get('/midia/:type/:id', controller.get)

module.exports = router