const express = require('express')
const router = express.Router()
const status_controller = require('../controllers/status_controller')
const check_auth = require('../middlewares/check-auth')


router.post('/', status_controller.add_status)
router.patch('/:statusId', check_auth, status_controller.update_status)
router.delete('/:statusId', check_auth, status_controller.delete_status)

router.get('/', status_controller.get_all_status)
router.get('/:statusId', status_controller.get_a_status)


module.exports = router