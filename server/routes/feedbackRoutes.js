const { authMiddleware } = require('../middleware/authMiddleware'); // ✅ destructuring
const { createFeedback, getAverageRating } = require('../controllers/feedbackController');

const router = require('express').Router();

router.post('/', authMiddleware, createFeedback);
router.get('/average/:courseId', getAverageRating);

module.exports = router;
