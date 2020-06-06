const express = require('express')
const router = express.Router()
const post_controller = require('../controllers/post_controller')
const check_auth = require('../middlewares/check-auth')


router.get('/', post_controller.get_all_post)
router.get('/posting/all', post_controller.get_all_post_is_posting)
router.get('/pending/all', check_auth, post_controller.get_all_post_pendding)
router.get('/:postId', post_controller.get_a_post)
router.post('/', check_auth, post_controller.add_post)
router.delete('/:postId', check_auth, post_controller.delete_post)
router.patch('/:postId', check_auth, post_controller.update_post)
router.patch('/status/:postId', check_auth, post_controller.update_post_status)
// router.patch('/hot/:postId', post_controller.update_post_status)



module.exports = router