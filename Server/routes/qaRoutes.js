const express = require('express');
const { askQuestion } = require('../controllers/qaController');
const router = express.Router();

router.post('/', askQuestion);

module.exports = router;
