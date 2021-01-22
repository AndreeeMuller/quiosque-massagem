const router = require('express-promise-router')()
const controller = require('../controllers/usuario')

router.get('/teste', controller.teste)
router.post('/usuario', controller.create)
router.put('/usuario', global.tokenValidation, controller.update)
router.delete('/usuario', global.tokenValidation, controller.delete)

module.exports = router