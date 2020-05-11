const express = require('express');
// const multer = require('multer');

const router = express.Router();

const checkAuth = require('../middlewares/check-auth');
const FeedbacksController = require('../controllers/feedbacks');

router.get('/', FeedbacksController.feedbacks_get_all);

router.post('/', checkAuth, FeedbacksController.feedbacks_create_feedback);

router.get('/:feedbackId', FeedbacksController.feedbacks_get_feedback);

router.patch('/:feedbackId', checkAuth, FeedbacksController.feedbacks_update_feedback);

router.delete('/:feedbackId', checkAuth, FeedbacksController.feedbacks_delete_feedback);

module.exports = router;