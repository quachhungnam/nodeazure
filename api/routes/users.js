const express = require('express');
// const multer = require('multer');

const router = express.Router();

const checkAuth = require('../middlewares/check-auth');
const UsersController = require('../controllers/users');

router.get('/', checkAuth, UsersController.users_get_all);

router.post('/', checkAuth, UsersController.users_create_user);

router.get('/:userId', checkAuth, UsersController.users_get_user);

router.patch('/:userId', checkAuth, UsersController.users_update_user);

module.exports = router;