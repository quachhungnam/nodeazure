const express = require('express')
const router = express.Router()
const rate_controller = require('../controllers/rate_controller')
const check_auth = require('../middlewares/check-auth')


router.get('/', rate_controller.get_all_rate)
router.get('/rateofpost/:postId', rate_controller.get_all_rate_of_post)
router.get('/:rateId', rate_controller.get_a_rate)
router.post('/', check_auth, rate_controller.add_rate)
router.delete('/:rateId', check_auth, rate_controller.delete_rate)
router.patch('/:rateId', check_auth, rate_controller.update_rate)


module.exports = router