const express = require('express');
const { searchDocs } = require('../controllers/searchController');
const router = express.Router();

// POST /api/search
router.post('/', searchDocs);

module.exports = router;
