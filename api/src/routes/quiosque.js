const router = require('express-promise-router')()
const controller = require('../controllers/quiosque')

router.post('/quiosque', global.tokenValidation, controller.create)
router.put('/quiosque', global.tokenValidation, controller.update)
router.delete('/quiosque', global.tokenValidation, controller.delete)

module.exports = router