const router = require('express-promise-router')()
const controller = require('../controllers/cadeira')

router.post('/cadeira', global.tokenValidation, controller.create)
router.put('/cadeira', global.tokenValidation, controller.update)
router.delete('/cadeira', global.tokenValidation, controller.delete)

module.exports = router