const router = require('express-promise-router')()
const controller = require('../controllers/quiosqueRecolheCadeira')

router.post('/quiosque/recolhe/cadeira', global.tokenValidation, controller.create)
router.put('/quiosque/recolhe/cadeira', global.tokenValidation, controller.update)
router.delete('/quiosque/recolhe/cadeira', global.tokenValidation, controller.delete)

module.exports = router