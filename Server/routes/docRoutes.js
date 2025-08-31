const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const {
  createDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  askQuestion,
 summarizeDoc,
  generateTags,
  getDocHistory,
} = require('../controllers/docController');

const router = express.Router();

// CRUD
router.route('/')
  .get(protect, getDocs)
  .post(protect, createDoc);

router.route('/:id')
  .get(protect, getDoc)
  .put(protect, updateDoc)
  .delete(protect, deleteDoc);

// Q&A
router.route('/qa').post(protect, askQuestion);

// AI helpers (note: using :id in path)
router.post('/:id/summarize', protect,summarizeDoc);
router.post('/:id/tags', protect, generateTags);
router.get('/:id/history', protect, getDocHistory);
router.put('/api/docs/:id', protect, updateDoc);

module.exports = router;
