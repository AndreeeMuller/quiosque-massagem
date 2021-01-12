const router = require('express-promise-router')()
const controller = require('../controllers/quiosqueRecolhe')

router.get('/quiosque/recolhe/:idQuiosqueRecolhe', global.tokenValidation, controller.getByIdQuiosqueRecolhe)
router.post('/quiosque/:idQuiosque/recolhe', global.tokenValidation, controller.create)
router.put('/quiosque/recolhe/:idQuiosqueRecolhe', global.tokenValidation, controller.update)

module.exports = router