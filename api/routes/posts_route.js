const express = require('express')
const router = express.Router()
const post_controller = require('../controllers/post_controller')
const check_auth = require('../middlewares/check-auth')


router.post('/', check_auth, post_controller.add_post)
router.patch('/:postId', check_auth, post_controller.update_post)
router.patch('/status/:postId', check_auth, post_controller.update_post_status)
router.delete('/:postId', check_auth, post_controller.delete_post)

router.get('/', post_controller.get_all_post)
router.get('/:postId', post_controller.get_a_post)
router.get('/status/:code', post_controller.get_all_post_with_status)
router.get('/type/:typeId?/account/:hostId?', post_controller.get_all_post_with_options)


module.exports = router