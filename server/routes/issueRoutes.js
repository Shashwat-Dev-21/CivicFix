const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  addComment,
  toggleUpvote
} = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createIssue);
router.get('/', getIssues);
router.get('/:id', getIssueById);
router.put('/:id', protect, updateIssue);
router.delete('/:id', protect, deleteIssue);
router.post('/:id/comments', protect, addComment);
router.post('/:id/upvote', protect, toggleUpvote);

module.exports = router;