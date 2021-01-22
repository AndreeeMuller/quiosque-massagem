const router = require('express-promise-router')()
const controller = require('../controllers/quiosque')

router.get('/quiosque/getAll', global.tokenValidation, controller.getAll)
router.post('/quiosque', global.tokenValidation, controller.create)
router.put('/quiosque', global.tokenValidation, controller.update)
router.delete('/quiosque', global.tokenValidation, controller.delete)

module.exports = router