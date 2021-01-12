const router = require('express-promise-router')()
const controller = require('../controllers/quiosquecadeira')

router.get('/quiosque/cadeira/all', global.tokenValidation, controller.getAll)
router.post('/quiosque/cadeira', global.tokenValidation, controller.create)
router.delete('/quiosque/cadeira', global.tokenValidation, controller.delete)

module.exports = router