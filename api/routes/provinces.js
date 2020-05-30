const express = require('express');
// const multer = require('multer');

const router = express.Router();

const checkAuth = require('../middlewares/check-auth');
const ProvincesController = require('../controllers/provinces');

router.get('/', ProvincesController.provinces_get_all);

router.post('/', ProvincesController.provinces_create_province);

router.get('/:provinceId', ProvincesController.provinces_get_province);

router.patch('/:provinceId', ProvincesController.provinces_update_province);

router.delete('/:provinceId', ProvincesController.provinces_delete_province);

module.exports = router;