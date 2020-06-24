const express = require('express')
const router = express.Router()
const transaction_controller = require('../controllers/transaction_controller')
const check_auth = require('../middlewares/check-auth')


router.post('/', check_auth, transaction_controller.add_transaction)
router.patch('/:transactionId', check_auth, transaction_controller.update_transaction)
router.delete('/:transactionId', check_auth, transaction_controller.delete_transaction)

router.get('/', transaction_controller.get_all_transaction)
router.get('/account/all', check_auth, transaction_controller.get_all_transaction_account)
router.get('/:transactionId', transaction_controller.get_a_transaction)

module.exports = router