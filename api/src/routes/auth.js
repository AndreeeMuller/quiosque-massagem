const router = require('express-promise-router')()
const controller = require('../controllers/auth')

router.post('/auth', controller.create)

module.exports = router