const express = require('express')
const router = express.Router()
const rate_controller = require('../controllers/rate_controller')



router.get('/', rate_controller.get_all_rate)
router.get('/:rateId', rate_controller.get_a_rate)
router.post('/', rate_controller.add_rate)
router.delete('/:rateId', rate_controller.delete_rate)
router.patch('/:rateId', rate_controller.update_rate)


module.exports = router