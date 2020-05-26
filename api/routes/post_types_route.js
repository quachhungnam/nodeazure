const express = require('express')
const router = express.Router()
const post_type_controller = require('../controllers/post_type_controller')



router.get('/', post_type_controller.get_all_post_type)
router.get('/:posttypeId', post_type_controller.get_a_post_type)
router.post('/', post_type_controller.add_post_type)
router.delete('/:posttypeId', post_type_controller.delete_post_type)
router.patch('/:posttypeId', post_type_controller.update_post_type)



module.exports = router