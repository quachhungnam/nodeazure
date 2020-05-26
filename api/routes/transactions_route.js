const express = require('express')
const router = express.Router()
const transaction_controller = require('../controllers/transaction_controller')


router.get('/', transaction_controller.get_all_transaction)
router.get('/:transactionId', transaction_controller.get_a_transaction)
router.post('/', transaction_controller.add_transaction)
router.delete('/:transactionId', transaction_controller.delete_transaction)
router.patch('/:transactionId', transaction_controller.update_transaction)


module.exports = router