const router = require('express-promise-router')()
const controller = require('../controllers/quiosquecadeira')

router.post('/quiosque/cadeira', global.tokenValidation, controller.create)
router.delete('/quiosque/cadeira', global.tokenValidation, controller.delete)

module.exports = router